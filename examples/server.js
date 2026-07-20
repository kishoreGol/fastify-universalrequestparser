const Fastify = require('fastify');

const app = Fastify({
    logger: true
});

app.register(require('../src'));

app.post('/users', async (request) => {

    console.log(request.body);

    return {
        success: true,
        parsing: request.parsingInfo,
        body: request.body
    };

});

app.listen({
    port: 4000
});