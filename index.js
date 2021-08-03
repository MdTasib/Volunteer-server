const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Start');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do24a.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteer").collection("collection");

  // post events on database
  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    collection.insertOne(newEvent)
      .then(result => {
        res.send(result.acknowledged);
      });
  });

  // get data from database
  app.get('/events', (req, res) => {
    collection.find({})
      .toArray((err, docs) => {
        res.send(docs);
      })
  });

  // delete events
  app.delete('/deleteEvent/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    collection.deleteOne({ _id: id })
      .then(result => {
        res.send(result.acknowledged);
      })
  })
});



app.listen(4000);