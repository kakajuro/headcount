import { Hono } from 'hono'

const counts = new Hono();

counts.get('/', (c) => {
  return c.text("count base route!");
});

export default counts;
