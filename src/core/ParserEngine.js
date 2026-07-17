class ParserEngine {

    constructor(registry) {

        this.registry = registry;

    }

    async parse(buffer, context = {}) {

        const parser = this.registry.find(
            buffer,
            context
        );

        if (!parser) {

            throw new Error(
                "Unsupported payload"
            );

        }

        return parser.parse(buffer, context);

    }

}

module.exports = ParserEngine;