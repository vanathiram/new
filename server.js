
//var catalogRouter = require('./routes/catalog'); //Import routes for "catalog" area of site
var compression = require('compression');
var helmet = require('helmet');

var port = process.env.PORT || 8080

const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(helmet());

app.use(compression()); //Compress all routes


app.listen(3000, function() {
  console.log('listening on 3000')
})


//app.get('/', (req, res) => {
//  res.sendFile('/Users/Vaishnavi/source/repos/nodecrud' + '/index.html')
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
//})
//var collection


const MongoClient = require('mongodb').MongoClient
 var db
  //var client
MongoClient.connect('mongodb://vanathi:velumani7@ds161520.mlab.com:61520/nodecrud1', (err, client) => {
  if (err) return console.log(err)
//  var mongoClient = new MongoClient;
 db = client.db('nodecrud1') // whatever your database name is
 app.listen(3001, () => {
   console.log('listening on 3000')
 })
})

app.post('/quotes', (req, res) => {
  //console.log(req.body)
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})



app.set('view engine', 'ejs')
//res.render(view, locals)

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})


app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

/*fetch({ /* request  })
.then(res => {
  if (res.ok) return res.json()
})
.then(data => {
  console.log(data)
  window.location.reload(true)
})
*/
app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})
