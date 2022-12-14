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
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select blog_id, blog_title, blog_text from blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Home', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_title text NOT NULL,
                     blog_text text NOT NULL);`,
              () => {
                db.all(` select blog_title, blog_text from blog`, (err, rows) => {
                  res.render('index', { title: 'Home', data: rows });
                });
              });
          }
        });
    });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About'});
});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Me'});
});
router.get('/admin', function(req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select blog_id, blog_title, blog_text from blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('admin', { title: 'Blog Admin Page', data: rows });
            });
          } else {
            console.log("Creating table");
            db.exec(`create table blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_title text NOT NULL,
                     blog_text text NOT NULL);`,
              () => {
                db.all(` select blog_title, blog_text from blog`, (err, rows) => {
                  res.render('admin', { title: 'Blog Admin Page', data: rows });
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
      db.exec(`insert into blog ( blog_title, blog_text)
                values ('${req.body.newtitle}',
                  '${req.body.newbody}');`)
      //redirect to homepage
      res.redirect('/admin');
    }
  );
})

router.post('/edit', (req, res, next) => {
  console.log("deleting stuff without checking if it is valid! SEND IT!");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("editing " + req.body.id);
      db.exec(`update blog set blog_text='${req.body.text}' where blog_id='${req.body.id}';`);    
      db.exec(`update blog set blog_title='${req.body.title}' where blog_id='${req.body.id}';`); 
      
      res.redirect('/admin');
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
      console.log("deleting " + req.body.id);
      db.exec(`delete from blog where blog_id='${req.body.id}';`);     
      res.redirect('/admin');
    }
  );
})

module.exports = router;

