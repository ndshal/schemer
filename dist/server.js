var express = require('express')
// var path = require('path')
var serveStatic = require('serve-static')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://app:nikitachris@ds123331.mlab.com:23331/schemer'

const app = express()

app.route('/api/dbs').get((req, res) => {
  MongoClient.connect(url, (err, db) => {
    console.log(err)
    let userId = req.query.id || req.params.id
    if (userId) {
      db.collection('dbs').find({ 'user_id': userId }).toArray(function (err, results) {
        console.log(results)
        console.log(err)
      })
    } else {
      db.collection('dbs').find().toArray(function (err, results) {
        console.log(results)
        console.log(err)
      })
    }
    res.redirect('/')
  })
})

app.use(serveStatic(__dirname))
var port = process.env.PORT || 5000
app.listen(port)
console.log('server started ' + port)
