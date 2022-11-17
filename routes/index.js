var express = require('express');
var router = express.Router();

var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='todo'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select todo_id, todo_txt from todo`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'ToDo App', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table todo (
                     todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     todo_txt text NOT NULL);`,
              () => {
                db.all(` select todo_id, todo_txt from todo`, (err, rows) => {
                  res.render('index', { title: 'ToDo App', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  console.log("Adding todo item to table without sanitizing input! YOLO BABY!!");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting " + req.body.todo);
      db.exec(`insert into todo ( todo_txt)
                values ('${req.body.todo}');`)
      //redirect to homepage
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  console.log("deleting stuff without checking if it is valid! SEND IT!");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting " + req.body.todo);
      db.exec(`delete from todo where todo_id='${req.body.todo}';`);     
      res.redirect('/');
    }
  );
})

module.exports = router;

