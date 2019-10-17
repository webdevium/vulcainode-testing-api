require('dotenv').config();

const httpsLocalhost = require('https-localhost')();
const http = require('http');

const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

app.use(cors());

router.get('/books/:id', async ctx => {
  const id = ctx.params.id;
  const book = {
    id,
    name: `Book name ${id}`,
    authors: []
  };
  for (let i = 1; i <= 10; i++) {
    book.authors.push(ctx.router.url('author', {id: i}));
  }

  await new Promise(resolve => setTimeout(resolve, 200));
  ctx.body = book;
});

router.get('/books', async ctx => {
  const books = [];
  for (let i = 0; i < 10; i++) {
    const id = i + 1;
    const book = {
      id,
      name: `Book name ${id}`,
      authors: []
    };
    for (let i = 1; i <= 10; i++) {
      book.authors.push(ctx.router.url('author', {id: i}));
    }

    books.push(book);
  }

  await new Promise(resolve => setTimeout(resolve, 200));
  ctx.body = books;
});

router.get('author', '/authors/:id', async ctx => {
  await new Promise(resolve => setTimeout(resolve, 200));
  ctx.body = {
    id: ctx.params.id,
    name: `Author name ${ctx.params.id}`,
    company: ctx.router.url('company', {id: ctx.params.id})
  };
});

router.get('company', '/companies/:id', async ctx => {
  await new Promise(resolve => setTimeout(resolve, 200));
  ctx.body = {
    id: ctx.params.id,
    name: `Company name ${ctx.params.id}`,
    country: ctx.router.url('country', {id: ctx.params.id})
  };
});

router.get('country', '/countries/:id', async ctx => {
  await new Promise(resolve => setTimeout(resolve, 200));
  ctx.body = {
    id: ctx.params.id,
    name: `Country name ${ctx.params.id}`
  };
});

app
  .use(router.routes())
  .use(router.allowedMethods());

(async function () {
  const certs = await httpsLocalhost.getCerts();
  http.createServer(certs, app.callback()).listen(process.env.PORT || 2345);
})();
