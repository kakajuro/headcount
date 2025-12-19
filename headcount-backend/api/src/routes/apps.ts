import { Hono } from 'hono'
import db from '../db/db.ts';

const apps = new Hono();

interface app {
  name: string,
  shortname: string
}

apps.get('/all', (c) => {

  try {
    const query = "SELECT * FROM apps";
    const response = db.prepare(query).all();
    return c.json(response);
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

apps.post('/add', async (c) => {

    const body:app = await c.req.json();

    try {
      const insertData = db.prepare("INSERT INTO apps (name, shortname) VALUES (?, ?);");
      insertData.run(body.name, body.shortname);
      c.status(200);
      return c.text("App added sucessfully!");
    } catch (error) {
      c.status(500);
      return c.text(`Internal server error occurred: ${error}`);
    }

});

export default apps;
