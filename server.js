var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
  user : 'madheswaran1999',
  database: 'madheswaran1999',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD
};

var Pool= new Pool(config);
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var names=[];
app.get('/submit', function(req, res) {
  var name = req.query.name;
  names.push(name);
  res.send(JSON.stringify(names)); //JavaScript Object Notation
}
);


app.get('/test', function(req,res){
	Pool.query('select * from test', function(err, result){
		if (err) {
			res.status(500).send(err.toString());
		} else {
			res.send(JSON.stringify(result.rows));
		}
	});
});
  

var counter = 0;
app.get('/counter', function (req, res) {
  counter = counter + 1;
  res.send(counter.toString());
});


function createTemplate (data){
    var title = data.title;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
    <head>
    <title>
        ${title}    
    </title>
    <link href="/ui/style.css" rel="stylesheet" />
    
    </head>
    <a href="/">Home</a>
    <h1>${heading} </h1>
    ${content}
    <hr />
    </html>
    `;
    
    return htmlTemplate;
}

var Pool= new Pool(config);
app.get('/article/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});

function hash (input,salt) {
  var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
  return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function(req,res){
  var hashedString = hash(req.params.input,'this-is-random-string');
  res.send(hashedString);

});

app.post('/create-user', function (req, res) {
  // username, password
  // {"username": "tanmai", "password": "password"}
  // JSON
  var username = req.body.username;
  var password = req.body.password;
  var salt = crypto.randomBytes(128).toString('hex');
  var dbString = hash(password, salt);
  pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
     if (err) {
         res.status(500).send(err.toString());
     } else {
         res.send('User successfully created: ' + username);
     }
  });
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/me.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'me.jpg'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});