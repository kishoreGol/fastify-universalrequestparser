# fastify-universal-parser

A Fastify content-type parser that makes `request.body` **always plain JSON**,
no matter what the client actually sent:

- `application/json` → parsed normally
- `application/xml`, `text/xml` → converted to JSON (`fast-xml-parser`)
- missing / wrong / generic `Content-Type` (`text/plain`, `application/octet-stream`,
  no header at all) → the payload is sniffed (first non-whitespace byte:
  `{`/`[` → JSON, `<` → XML) and parsed accordingly
- large bodies, or bodies sent with `Transfer-Encoding: chunked` and no
  `Content-Length` → parsed **incrementally**, record by record, instead of
  being buffered whole in memory — and each record can be forwarded downstream
  the instant it's parsed, before the rest of the body has even arrived

Your route handler never has to care which of these happened:

```js
fastify.post('/ingest', async (request) => {
  return request.body; // always JSON, regardless of what was sent
});
```

## Install

```bash
npm install
```

## Run the example

```bash
npm start
# in another terminal:
curl -X POST http://localhost:3999/ingest \
  -H "Content-Type: application/xml" \
  -d '<user><name>Alice</name><age>30</age></user>'
# -> {"receivedType":"object","body":{"user":{"name":"Alice","age":30}}}
```

## Usage

```js
const Fastify = require('fastify');
const universalParser = require('./plugin/universal-parser');

const fastify = Fastify();

fastify.register(universalParser, {
  sizeThreshold: 1_000_000, // bytes; bodies at/above this (or unbounded
                             // chunked bodies) stream instead of buffering
  maxBodySize: 50_000_000,  // hard cap for the buffered path
  xmlItemTag: 'item',       // optional; auto-detected if omitted
  onItem: async (item, index, request) => {
    // called for every record AS SOON AS IT'S PARSED during the
    // streaming path — forward it downstream immediately here
  },
});

fastify.post('/ingest', async (request) => {
  return request.body; // plain JSON object or array
});
```

## How the two code paths work

**Buffered path** (small/normal bodies — the common case)
`lib/sniff.js` classifies the payload from the `Content-Type` header,
falling back to sniffing the first bytes. `lib/xml.js` converts XML to
JSON with `fast-xml-parser`; JSON is just `JSON.parse`'d.

**Streaming path** (large bodies, or chunked bodies with no
`Content-Length`)
`lib/streaming.js` parses without ever holding the raw body as one big
string:
- JSON: `stream-json`'s `streamArray` emits each array element as soon
  as its closing `}`/`]` is seen.
- XML: a `sax` parser tracks depth and emits each direct child of the
  root (e.g. each `<item>` in `<items>...</items>`) as soon as its
  closing tag is seen.

Either way, `onItem` fires per-record while the rest of the body is
still arriving over the wire — genuine chunk-in → chunk-out behavior —
and the assembled array is still placed on `request.body` for handlers
that want the whole thing.

## Forwarding to a downstream JSON API

`lib/forwarder.js` has two helpers for sending the normalized data on:

```js
const { forwardWhole, createBatchForwarder } = require('./lib/forwarder');

// one-shot: send the whole parsed body downstream
await forwardWhole('https://api.example.com/records', request.body);

// streaming: batch records as they're parsed and flush periodically
const batcher = createBatchForwarder('https://api.example.com/records', { batchSize: 100 });
fastify.register(universalParser, {
  onItem: (item) => batcher.push(item),
});
// after the request completes (e.g. in the route handler):
await batcher.flush();
```

## Files

```
plugin/universal-parser.js   the Fastify plugin (register this)
lib/xml.js                   XML -> JSON (buffered)
lib/sniff.js                 content-type classification / sniffing
lib/streaming.js             streaming JSON/XML -> JSON, per-item callback
lib/forwarder.js             send parsed JSON to a downstream API
examples/server.js           runnable demo
```

## Notes / things to tune for production

- `sizeThreshold` and `maxBodySize` are conservative defaults — size
  them to your actual traffic.
- The streaming XML parser assumes a flat list of repeated elements
  under one root (`<items><item/>...</items>`). Deeply nested
  record-of-records XML would need a bit more logic in
  `streamXmlItems`.
- `forwardWhole`/`createBatchForwarder` use `undici` directly with no
  retry logic — add retries/backoff for a production integration.
