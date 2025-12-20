import { Hono } from 'hono'
import db from '../db/db.ts';

const counts = new Hono();

interface count {
  name: string,
  count: number,
  type: string
}

interface response {
  id: number
}

counts.get("/all", (c) => {

  try {
    const query = "SELECT * FROM counts";
    const response = db.prepare(query).all();
    return c.json(response);
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

counts.post('/add', async (c) => {

  let body:count = await c.req.json();

  try {
    const query = `SELECT id FROM apps WHERE name = '${body.name}';`;
    let response = await db.prepare(query).get() as response;
    var appID = response!.id;
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }


  try {

    let type = body.type.toLowerCase();
    let query;

    if (type == "chrome") {
      query = `INSERT INTO counts (appid, usercountChrome, created_at) VALUES (?, ?, ?);`;
    } else if (type == "firefox") {
      query = `INSERT INTO counts (appid, usercountFirefox, created_at) VALUES (?, ?, ?);`;
    } else if (type == "edge") {
      query = `INSERT INTO counts (appid, usercountEdge, created_at) VALUES (?, ?, ?);`;
    } else {
      throw new Error("Platform type invalid");
    }

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const insertData = db.prepare(query);
    insertData.run(appID, body.count, unixTimestamp);
    c.status(200);
    return c.text("Count added sucessfully!");
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

export default counts;
