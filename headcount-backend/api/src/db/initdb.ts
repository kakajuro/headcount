import db from "./db.ts";

const createAppsTable =
`CREATE TABLE apps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name STRING NOT NULL,
  shortname STRING NOT NULL
)`;

const createUsercountTable =
`CREATE TABLE counts (
  appid INTEGER NOT NULL,
  usercountChrome INTEGER,
  usercountFirefox INTEGER,
  usercountEdge INTEGER,
  created_at INTEGER NOT NULL
)`;

const tableQuery = "PRAGMA table_info(apps);";
const tableExists = db.prepare(tableQuery).get();

if (tableExists === undefined) {

  try {
    db.exec(createAppsTable);
    console.log("Created apps table");
  } catch (error) {
    console.log(`An error occurred: ${error}`)
  }

  try {
    db.exec(createUsercountTable);
    console.log("Created usercount table");
  } catch (error) {
    console.log(`An error occurred: ${error}`)
  }

}
