const Fastify = require('fastify');

const app = Fastify({
    logger: true
});

app.register(require('../src'));

app.post('/users', async (request) => {

    console.log(request.body);

    return {
        received: request.body.toString()
    };
});

app.listen({
    port: 3000
});