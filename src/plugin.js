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
     * Register universal content parser.
     */
    fastify.addContentTypeParser(
        '*',
        {
            parseAs: 'buffer',
            bodyLimit: config.maxBodySize
        },
        async function (request, body) {

            return universalParser.handleRequest(
                request,
                body
            );

        }
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