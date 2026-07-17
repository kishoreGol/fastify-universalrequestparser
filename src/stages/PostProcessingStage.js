'use strict';

const Stage = require('../pipeline/Stage');

class PostProcessingStage extends Stage {
    async execute(context) {
        // TODO:
        // - Merge chunks
        // - Decompress gzip/brotli
        // - Decode charset

        return context;
    }
}

module.exports = PostProcessingStage;