import { Hono } from 'hono'
import db from '../db/db.ts';

import { getDayDifference } from "../util.ts";

import type { countAdd, countRecord, countResponse, response } from "../types.ts"

const counts = new Hono();

counts.get("/all", async (c) => {

  try {
    const query =
    `SELECT A.id, A.shortname, A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS C
    INNER JOIN apps AS A ON C.appid = A.id
    WHERE A.deleted = 0;
    `;
    const response = db.prepare(query).all();
    return c.json(response, 200);
  } catch (error:any) {
    console.log(error.message);
    return c.json({ error: error.message }, 500);
  }

});

// Use shortname
counts.get("/all/:name", async (c) => {

  const name = c.req.param("name");

  try {
    const query = "SELECT COUNT(*) FROM apps WHERE shortname = ?";
    const response = db.prepare(query).get(name) as countResponse;

    if (!parseInt(response["COUNT(*)"], 10)) {
      throw new Error("App with that shortname not found!")
    }
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

  try {
    const query =
    `SELECT A.id, A.shortname, A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS c
    INNER JOIN apps as A ON C.appid = A.id
    WHERE A.shortname = ?`;
    const response = db.prepare(query).all(name);
    return c.json(response, 200);
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

});


counts.get("/test", async (c) => {
  try {
    const query =
    `SELECT A.id, A.shortname, A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS c
    INNER JOIN apps as A ON C.appid = A.id
    WHERE C.created_at = (
      SELECT MAX(C2.created_at)
      FROM counts AS C2
      WHERE C2.appid = C.appid
    ) AND A.deleted = 0
    ORDER BY C.created_at DESC`;
    const response = db.prepare(query).all();
    return c.json(response, 200);
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }
});

counts.get("/recent", async (c) => {

  try {
    const query =
    `SELECT A.id, A.shortname, A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS c
    INNER JOIN apps as A ON C.appid = A.id
    WHERE C.created_at = (
      SELECT MAX(C2.created_at)
      FROM counts AS C2
      WHERE C2.appid = C.appid
    ) AND A.deleted = 0
    ORDER BY C.created_at DESC`;
    const response = db.prepare(query).all();
    return c.json(response, 200);
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

});

// Use shortname
counts.get("/recent/:name", async (c) => {

  const nameParam = c.req.param("name");
  const name = nameParam.replace(":", "");

  const limit = c.req.query('limit') || '1';
  const limitNum = parseInt(limit, 10);

  try {
    const query = "SELECT COUNT(*) FROM apps WHERE shortname = ?";
    const response = db.prepare(query).get(name) as countResponse;

    if (!parseInt(response["COUNT(*)"], 10)) {
      throw new Error("App with that shortname not found!")
    }
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

  try {
    const query =
    `SELECT A.id, A.shortname, A.name, C.usercountChrome, C.usercountFirefox, C.usercountEdge, C.created_at
    FROM counts AS c
    INNER JOIN apps as A ON C.appid = A.id
    WHERE A.shortname = ?
    ORDER BY C.created_at DESC
    LIMIT ?`;
    const response = db.prepare(query).all(name, limitNum);
    return c.json(response, 200);
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

});

// Used to get weekly report
counts.get('/weekly', async (c) => {

  var appShortnames:string[] = [];
  var weekData:countRecord[] = [];

  // Add all shortnames to list
  try {
    const query = "SELECT shortname FROM apps WHERE deleted = 0";
    const response = db.prepare(query).all() as {shortname: string}[];
    response.forEach((obj: {shortname: string}) => {
      appShortnames.push(obj["shortname"]);
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }

  try {

    await Promise.all(appShortnames.map(async (name) => {
      let finalItemObj, oldestRecord;

      const res = await counts.request(`recent/:${name}?limit=7`);
      const recentItems: countRecord[]  = await res.json();
      finalItemObj = recentItems[0];

      oldestRecord = recentItems[recentItems.length-1];

      let dayDifference = getDayDifference(finalItemObj.created_at, oldestRecord.created_at);
      let userDifference = (finalItemObj.usercountChrome + finalItemObj.usercountFirefox + finalItemObj.usercountEdge) - (oldestRecord.usercountChrome + oldestRecord.usercountFirefox + oldestRecord.usercountEdge)

      finalItemObj.dayDifference = dayDifference;
      finalItemObj.userDifference = userDifference;

      weekData.push(finalItemObj);
      console.log(weekData);
      console.log(`Calulated data for: ${name}`);
    }));

    console.log(weekData);
    return c.json(weekData, 200);

  } catch (error:any) {
    console.log(error.message);
    return c.json({ error: error.message }, 500);
  }

});

// Use shortname
counts.post('/add', async (c) => {

  let body:countAdd = await c.req.json();

  try {
    const query = `SELECT id FROM apps WHERE shortname = ?;`;
    let response = await db.prepare(query).get(body.shortname) as response;
    var appID = response.id;
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

  try {
    let query = `INSERT INTO counts (appid, usercountChrome, usercountFirefox, usercountEdge, created_at) VALUES (?, ?, ?, ?, ?);`;

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const insertData = db.prepare(query);
    insertData.run(appID, body.usercountChrome, body.usercountFirefox, body.usercountEdge, unixTimestamp);
    return c.json({ message: "Count added sucessfully!" }, 200);
  } catch (error:any) {
    return c.json({ error: error.message }, 500);
  }

});

export default counts;
