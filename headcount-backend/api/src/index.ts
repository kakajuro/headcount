import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dotenv from 'dotenv'

import { rateLimiter } from "hono-rate-limiter";

import apps from './routes/apps.ts';
import counts from './routes/counts.ts';

dotenv.config();


type Variables = {
  app : Hono
}

const app = new Hono<{ Variables: Variables }>()

// Middleware to inject app instance into context
app.use('*', async (c, next) => {
  //@ts-ignore
  c.set("app", app);
  await next();
});

app.use('*', cors({
  origin: process.env.PRODUCTION_API_URL!,
}));

app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    keyGenerator: (c) => {
      return c.req.header("x-forwarded-for")?.split(',')[0].trim()
             ?? c.req.header("x-real-ip")
             ?? c.req.header("cf-connecting-ip")
             ?? "unknown";
    },
    message: "Rate limit exceeded. Please wait before making more requests."
  })
);

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
