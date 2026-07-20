class BaseParser {
    constructor(name, priority = 0, contentType = null) {
        this.name = name;
        this.priority = priority;
        this.contentType = contentType;
    }

    detect(buffer, context) {
        throw new Error("detect() not implemented");
    }

    async parse(buffer, context) {
        throw new Error("parse() not implemented");
    }
}

module.exports = BaseParser;