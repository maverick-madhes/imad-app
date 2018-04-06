var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
  user : 'madheswaran1999',
  database: 'madheswaran1999',
  host: 'db.imad.hasura-app.io',
  port: '5432',
  password: 'db-madheswaran1999-75273'
};
var app = express();
app.use(morgan('combined'));

var names=[];
app.get('/submit', function(req, res) {
  var name = req.query.name;
  names.push(name);
  res.send(JSON.stringify(names)); //JavaScript Object Notation
}
);

var Pool= new Pool(config);
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




var articles = {
    one : {
      title: 'one',
      heading: 'page one',
      content: `<div class="container">
     hello world...i unconciously typed hello world.Files on the sidebar represent the source code of your web app. These files are all actually saved in a git repository on your github account. This console allows you to edit these files, deploy your app, and save these files back to your github repository.Files on the sidebar represent the source code of your web app. These files are all actually saved in a git repository on your github account. This console allows you to edit these files, deploy your app, and save these files back to your github repository. 
    </div>
    <div>
    <p>
        hello world.Files on the sidebar represent the source code of your web app. These files are all actually saved in a git repository on your github account. This console allows you to edit these files, deploy your app, and save these files back to your github repository.Files on the sidebar represent the source code of your web app. These files are all actually saved in a git repository on your github account. This console allows you to edit these files, deploy your app, and save these files back to your github repository.
       </p>
    <table border="1">
    <tr>
    <td>one</td>
    <td>two</td>
    </tr>
    </table>
    
    </div>`
    },
    two : {
    title: 'two',
     heading: 'page two',
    content: `<div class="container">

	<p>
		here we go...lets try it out 
	</p>
    
    </div>
    </body>`
    },
    three : {
          title: 'three',
      heading: 'page three',
      content: `<div class="container">
    <p>
        bla bla bla bla bla ...wow i ty[e d so fast...but there is a typo...fuck
    </p>
</div>`
    },
};

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
app.get('/:articleName', function (req, res) {
    var articleName = req.params.articleName;
  res.send(createTemplate(articles[articleName]));
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