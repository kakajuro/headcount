import { Hono } from 'hono'
import db from '../db/db.ts';

import type { app, appDelete, countAdd, shortnameResponse } from '../types.ts';

const apps = new Hono();

apps.get('/all', async (c) => {

  console.log(new URL(c.req.url).host);

  try {
    const query = "SELECT * FROM apps WHERE deleted = 0";
    const response = db.prepare(query).all();
    return c.json(response, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }

});

apps.post('/add', async (c) => {

    const body:app = await c.req.json();

    // Check if duplicate shortname exists
    try {
      const query = `SELECT COUNT(shortname) FROM apps WHERE shortname = ? AND deleted = 0`;
      const response = db.prepare(query).get(body.shortname) as shortnameResponse;

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
    } catch (error:any) {
      return c.json({ error: error.message }, 500);
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

    } catch (error:any) {
      return c.json({ error: error.message }, 500);
    }


});

apps.delete('/delete', async (c) => {

  const body:appDelete = await c.req.json();

  try {

    const deleteRecord = db.prepare("UPDATE apps SET deleted = 1 WHERE id = ?");
    deleteRecord.run(body.id);
    console.log("App deleted sucessfully");

    return c.json({message: "App deleted sucessfully"}, 200);

  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

});

export default apps;
