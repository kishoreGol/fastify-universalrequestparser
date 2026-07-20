class ParserEngine {

    constructor(registry) {
        this.registry = registry;
    }

    async parse(buffer, context = {}) {

        const parser = this.registry.find(buffer, context);

        if (!parser) {
            throw new Error("Unsupported payload");
        }

        const data = await parser.parse(buffer, context);

        return {
            parser,
            data
        };
    }
}

module.exports = ParserEngine;