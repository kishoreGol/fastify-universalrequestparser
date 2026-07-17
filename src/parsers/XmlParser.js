const BaseParser = require("../core/BaseParser");
const { XMLParser } = require("fast-xml-parser");

class XmlParser extends BaseParser {

    constructor() {
        super("xml", 90);

        this.parser = new XMLParser();
    }

    detect(buffer) {

        return buffer
            .toString("utf8")
            .trim()
            .startsWith("<");

    }

    async parse(buffer) {

        return this.parser.parse(
            buffer.toString("utf8")
        );

    }

}

module.exports = XmlParser;