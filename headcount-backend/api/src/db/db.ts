import Database from "better-sqlite3";

export const createDB = () => {

  let db;

  if (!process.env.IS_PRODUCTION || process.env.IS_PRODUCTION == "0") {
    db = new Database("src/db/database.db");
  } else {
    db = new Database("./dist/database.db");
  }

  return db;

}

const db = createDB();
export default db;
