'use strict';

const Stage = require('../pipeline/Stage');

class PreProcessingStage extends Stage {
    async execute(context) {
        // TODO:
        // - Merge chunks
        // - Decompress gzip/brotli
        // - Decode charset

        return context;
    }
}

module.exports = PreProcessingStage;