'use strict';

const createRegistry = require('./ParserFactory');
const ParserEngine = require('./ParserEngine');

class UniversalParser {

    constructor(fastify, config) {

        this.fastify = fastify;
        this.config = config;

        this.registry = null;
        this.parserEngine = null;

    }

    /**
     * Initialize all components.
     */
    async initialize() {

        this.registry = createRegistry(this.config);

        this.parserEngine = new ParserEngine(
            this.registry
        );

    }

    /**
     * Handle incoming request.
     */
    async handleRequest(request, buffer) {

        const context = {

            request,

            headers: request.headers,

            method: request.method,

            url: request.url,

            contentType:
                request.headers['content-type'],

            contentLength:
                request.headers['content-length']

        };

        const result =
            await this.parserEngine.parse(
                buffer,
                context
            );

        return result;

    }

    /**
     * Startup hook.
     */
    async onReady() {

        if (!this.config.enableLogging) {

            return;

        }

        this.fastify.log.info(
            '==================================='
        );

        this.fastify.log.info(
            'Universal Parser Started'
        );

        this.fastify.log.info(
            'Registered Parsers:'
        );

        for (const parser of this.registry.parsers) {

            this.fastify.log.info(
                `${parser.name} (${parser.priority})`
            );

        }

        this.fastify.log.info(
            '==================================='
        );

    }

    /**
     * Shutdown hook.
     */
    async destroy() {

        if (this.config.enableLogging) {

            this.fastify.log.info(
                'Universal Parser Shutdown'
            );

        }

    }

    /**
     * Registry accessor.
     */
    getRegistry() {

        return this.registry;

    }

    /**
     * Parser engine accessor.
     */
    getParserEngine() {

        return this.parserEngine;

    }

}

module.exports = UniversalParser;