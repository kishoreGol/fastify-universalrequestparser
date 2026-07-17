'use strict';

const Stage = require('../pipeline/Stage');

class ParsingStage extends Stage {

    constructor(services = {}) {
        super();

        this.parserEngine = services.parserEngine;
    }

    shouldExecute(context) {
        return !!context.metadata.detectedContentType;
    }

    async execute(context) {

        context.body = await this.parserEngine.parse(
            context
        );

        return context;
    }

}

module.exports = ParsingStage;