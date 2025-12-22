import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import apps from './routes/apps.ts';
import counts from './routes/counts.ts';

type Variables = {
  app : Hono
}

const app = new Hono<{ Variables: Variables }>()

app.get('/ok', (c) => {
  return c.text('headcount api ok!')
});

// Middleware to inject app instance into context
app.use('*', async (c, next) => {
  //@ts-ignore
  c.set("app", app);
  await next();
});

app.route('/apps', apps);
app.route('/counts', counts);


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
