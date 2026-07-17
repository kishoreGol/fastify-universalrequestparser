class Context {
    constructor(request, rawBody) {
        this.request = request;
        this.rawBody = rawBody;

        this.body = null;

        this.metadata = {
            declaredContentType: request.headers['content-type'],
            detectedContentType: null,
            charset: null,
            compressed: false
        };

        this.metrics = {};

        this.state = {};
    }
}