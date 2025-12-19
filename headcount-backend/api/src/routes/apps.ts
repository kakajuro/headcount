import { Hono } from 'hono'

const apps = new Hono();

apps.get('/', (c) => {
  return c.text("apps base route!");
})

export default apps;
