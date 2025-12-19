import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import apps from './routes/apps.ts';
import counts from './routes/counts.ts';

const app = new Hono()

app.get('/ok', (c) => {
  return c.text('headcount api ok!')
});

app.route('/apps', apps);
app.route('/counts', counts);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
