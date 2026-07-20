'use strict';

const defaults = require('./config');
const UniversalParser = require('./core/UniversalParser');

async function plugin(fastify, options = {}) {

    // Merge user config with defaults
    const config = {
        ...defaults,
        ...options
    };

    // Create parser orchestrator
    const universalParser = new UniversalParser(
        fastify,
        config
    );

    // Initialize internal components
    await universalParser.initialize();

    // Expose decorators
    fastify.decorate(
        'universalParser',
        universalParser
    );

    fastify.decorate(
        'parserRegistry',
        universalParser.getRegistry()
    );

    fastify.decorate(
        'parserEngine',
        universalParser.getParserEngine()
    );

    /**
     * Universal Parser Handler
     */
    const handler = async (request, body) => {

        console.log('================================');
        console.log('Incoming Request');
        console.log('Content-Type:', request.headers['content-type']);
        console.log('Raw Body:');
        console.log(body.toString());

        const parsed = await universalParser.handleRequest(
            request,
            body
        );
      console.log('Parsed Result:');
      console.log(parsed);
      console.log('================================',parsed.format);
        request.parsingInfo = {
        contentTypeInReqHeader: request.headers['content-type'],
        detectedFormat: parsed.format,      // e.g. xml/json/csv
        convertedTo: 'json'
    };


        return parsed;
    };

    /**
     * Remove Fastify default parsers
     */
    const contentTypes = [
        'application/json',
        'application/xml',
        'text/xml',
        'text/plain',
        'application/x-www-form-urlencoded'
    ];

    for (const type of contentTypes) {

        if (fastify.hasContentTypeParser(type)) {
            fastify.removeContentTypeParser(type);
        }

        fastify.addContentTypeParser(
            type,
            {
                parseAs: 'buffer',
                bodyLimit: config.maxBodySize
            },
            handler
        );
    }

    /**
     * Fallback parser
     */
    fastify.addContentTypeParser(
        '*',
        {
            parseAs: 'buffer',
            bodyLimit: config.maxBodySize
        },
        handler
    );

    /**
     * Startup Hook
     */
    fastify.addHook(
        'onReady',
        async () => {
            await universalParser.onReady();
        }
    );

    /**
     * Shutdown Hook
     */
    fastify.addHook(
        'onClose',
        async () => {
            await universalParser.destroy();
        }
    );
}

module.exports = plugin;