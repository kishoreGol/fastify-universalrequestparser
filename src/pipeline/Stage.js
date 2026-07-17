'use strict';

class Stage {
    shouldExecute(context) {
        return true;
    }

    async execute(context) {
        return context;
    }
}

module.exports = Stage;