const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j0eag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("tourism");
        const collection = database.collection("places");
        const BookedCollection = database.collection("booked");
        //get api from place
        app.get('/places', async (req, res) => {
            const cursor = collection.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const place = await collection.findOne(query);
            res.json(place);
        })

        //get api from book
        app.get('/booked', async (req, res) => {
            const cursor = BookedCollection.find({});
            const BookedResult = await cursor.toArray();
            res.send(BookedResult);
        })

        app.get('/booked/:id', async (req, res) => {
            const id = req.params.id;
            const bookedQuery = { _id: id };
            const booked = await BookedCollection.findOne(bookedQuery);
            res.json(booked);
        })

        // post
        app.post('/booked', async (req, res) => {
            const newData = req.body;
            const BookedResult = await BookedCollection.insertOne(newData);
            res.json(BookedResult);
        })
        //delete
        app.delete('/booked/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const BookedResult = await BookedCollection.deleteOne(query);
            res.json(BookedResult);
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('mongo');
});


app.listen(port, () => {
    console.log('running port', port);
});