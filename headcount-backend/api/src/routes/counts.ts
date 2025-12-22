import { Hono } from 'hono'
import db from '../db/db.ts';

import type { countAdd, countResponse, response } from "../types.ts"

const counts = new Hono();

counts.get("/all", async (c) => {

  try {
    const query =
    `SELECT A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS C
    INNER JOIN apps AS A ON C.appid = A.id;
    `;
    const response = db.prepare(query).all();
    return c.json(response);
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

// Use shortname
counts.get("/all/:name", async (c) => {

  const name = c.req.param("name");

  try {
    const query = "SELECT COUNT(*) FROM apps WHERE shortname = ?";
    const response = db.prepare(query).get(name) as countResponse;

    if (!parseInt(response["COUNT(*)"], 10)) {
      c.status(500);
      return c.text("App with that shortname not found!")
    }
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

  try {
    const query =
    `SELECT A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS c
    INNER JOIN apps as A ON C.appid = A.id
    WHERE A.shortname = ?`;
    const response = db.prepare(query).all(name);
    return c.json(response);
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

counts.get("/recent", async (c) => {

  try {
    const query =
    `SELECT A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS c
    INNER JOIN apps as A ON C.appid = A.id
    WHERE C.created_at = (
      SELECT MAX(C2.created_at)
      FROM counts AS C2
      WHERE C2.appid = C.appid
    )
    ORDER BY C.created_at DESC`;
    const response = db.prepare(query).all();
    return c.json(response);
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

// Use shortname
counts.get("/recent/:name", async (c) => {

  const name = c.req.param("name");

  const limit = c.req.query('limit') || '1';
  const limitNum = parseInt(limit, 10);

  try {
    const query = "SELECT COUNT(*) FROM apps WHERE shortname = ?";
    const response = db.prepare(query).get(name) as countResponse;

    if (!parseInt(response["COUNT(*)"], 10)) {
      c.status(500);
      return c.text("App with that shortname not found!")
    }
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

  try {
    const query =
    `SELECT A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS c
    INNER JOIN apps as A ON C.appid = A.id
    WHERE A.shortname = ?
    ORDER BY C.created_at DESC
    LIMIT ?`;
    const response = db.prepare(query).all(name, limitNum);
    return c.json(response);
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

counts.post('/add', async (c) => {

  let body:countAdd = await c.req.json();

  try {
    const query = `SELECT id FROM apps WHERE shortname = ?;`;
    let response = await db.prepare(query).get(body.shortname) as response;
    var appID = response.id;
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

  try {
    let query = `INSERT INTO counts (appid, usercountChrome, usercountFirefox, usercountEdge, created_at) VALUES (?, ?, ?, ?, ?);`;

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const insertData = db.prepare(query);
    insertData.run(appID, body.usercountChrome, body.usercountFirefox, body.usercountEdge, unixTimestamp);
    c.status(200);
    return c.text("Count added sucessfully!");
  } catch (error) {
    c.status(500);
    return c.text(`Internal server error occurred: ${error}`);
  }

});

export default counts;
