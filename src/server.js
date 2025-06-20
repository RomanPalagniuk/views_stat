const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const apiRouter = require('./routes/api');
const config = require('./config');

const app = new Koa();

app.use(bodyParser());
app.use(apiRouter.routes());

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});