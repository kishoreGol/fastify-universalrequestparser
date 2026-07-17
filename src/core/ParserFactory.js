const ParserRegistry = require("./ParserRegistry");

const JsonParser = require("../parsers/JsonParser");
const XmlParser = require("../parsers/XmlParser");

function createRegistry() {
    const registry = new ParserRegistry();

    registry.register(new JsonParser());
    registry.register(new XmlParser());

    return registry;
}

module.exports = createRegistry;