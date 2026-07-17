class BaseParser {
    constructor(name, priority = 0) {
        this.name = name;
        this.priority = priority;
    }

    detect(buffer, context) {
        throw new Error("detect() not implemented");
    }

    async parse(buffer, context) {
        throw new Error("parse() not implemented");
    }
}

module.exports = BaseParser;