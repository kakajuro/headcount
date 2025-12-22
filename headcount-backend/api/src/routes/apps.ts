import { Hono } from 'hono'
import db from '../db/db.ts';

import type { app, countAdd, shortnameResponse } from '../types.ts';

const apps = new Hono();

apps.get('/all', async (c) => {

  console.log(new URL(c.req.url).host);

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

    // Check if duplicate shortname exists
    try {
      const query = `SELECT COUNT(shortname) FROM apps WHERE shortname = ?`;
      const response = db.prepare(query).get(body.shortname) as shortnameResponse;

      console.log(response);

      if (parseInt(response["COUNT(shortname)"], 10) > 0) {
        console.log("found duplicate");
        throw new Error("Duplicate shortname");
      }

    } catch (error:any) {
      return c.json({ error: error.message }, 500);
    }

    try {
      const insertData = db.prepare("INSERT INTO apps (name, shortname) VALUES (?, ?);");
      insertData.run(body.name, body.shortname);
      console.log("App added sucessfully");

    } catch (error) {
      c.status(500);
      return c.text(`Internal server error occurred: ${error}`);
    }

    // Make internal request to give new app a blank record
    try {

      //@ts-ignore
      const app:Hono = c.get("app");

      let baseRecord:countAdd = {
        shortname: body.shortname,
        usercountChrome: 0,
        usercountEdge: 0,
        usercountFirefox: 0
      };

      const response = await app.request("counts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(baseRecord)
      });

      return c.json({ message: "App added sucessfully" }, 200);

    } catch (error) {
      c.status(500);
      return c.text(`Internal server error occurred: ${error}`);
    }


});

export default apps;
