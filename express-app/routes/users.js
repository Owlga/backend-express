const express = require('express');
const router = express.Router();
const allUsers = [];
allUsers.push({id: 1, name: "Юдина Ольга"})

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('mydb.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name text)`);

router.get('/', function(req, res, next) {
    db.all("SELECT id, name FROM users", [], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    });
});


router.post('/',
    function(req, res, next) {
      const name = req.body.name;
      const insert = "INSERT INTO users (name) VALUES (?)";
      db.run(insert, [name]);
      res.status(201).json(name);
    }
);

router.get("/:id", function(req, res, next) {
    const id = req.params.id;
    db.get("SELECT name FROM users WHERE id = @id", [id], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.send(rows);
        }
    });
})

module.exports = router;

function getNewId() {
  let maxId = 1;
  for (const user of allUsers) {
    maxId = Math.max(maxId, user.id);
  }
  return maxId + 1;
}