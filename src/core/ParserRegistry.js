class ParserRegistry {

    constructor() {

        this.parsers = [];

    }

    register(parser) {

        this.parsers.push(parser);

        this.parsers.sort(
            (a, b) => b.priority - a.priority
        );

    }

    find(buffer, context) {

        for (const parser of this.parsers) {

            if (parser.detect(buffer, context)) {

                return parser;

            }

        }

        return null;

    }

}

module.exports = ParserRegistry;