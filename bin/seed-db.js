#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/poochie-pals.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the poochie-pals database.');

  db.exec(`DROP TABLE Users;`);
  db.exec(`
    CREATE TABLE Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name STRING,
      username STRING,
      email STRING,
      user_type STRING,
      pet_name STRING,
      password STRING,
      createdAt DATETIME,
      updatedAt DATETIME
    );
  `);

  console.log('Done importing seed data.');
});
