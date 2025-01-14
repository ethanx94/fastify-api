const gql = require('fastify-gql');

const fastify = require('./server.js');
const routes = require('./routes');
const swagger = require('./config/swagger');
const schema = require('./schema');

fastify.register(gql, {
  schema,
  graphiql: true,
});

fastify.register(require('fastify-swagger'), swagger.options);

routes.forEach((route, index) => {
  fastify.route(route);
});

const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0');
    fastify.swagger();
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
