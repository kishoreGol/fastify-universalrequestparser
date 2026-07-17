const BaseParser = require("../core/BaseParser");

class JsonParser extends BaseParser {

    constructor() {
        super("json", 100);
    }

    detect(buffer) {
        const text = buffer.toString("utf8").trim();

        return (
            text.startsWith("{") ||
            text.startsWith("[")
        );
    }

    async parse(buffer) {
        return JSON.parse(buffer.toString("utf8"));
    }

}

module.exports = JsonParser;