const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ajoxj5t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const courseCollection = client.db('programmingSage').collection('courses');
        const reviewCollection = client.db('programmingSage').collection('reviews');
        const addCollection = client.db('programmingSage').collection('added');

        // get limited Data from mongoDb
        app.get('/courses', async (req, res) => {
            const query = {};
            const cursor = courseCollection.find(query).limit(3);
            const courses = await cursor.toArray();
            res.send(courses);
        });

        // get All data from mongodb
        app.get('/coursesAll', async (req, res) => {
            const query = {};
            const cursor = courseCollection.find(query);
            const courses = await cursor.toArray();
            res.send(courses);
        });

        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const coursesId = await courseCollection.findOne(query);
            res.send(coursesId);
        });

        // reviews API created
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        // get reviews data
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // Delete reviews
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        // crete added API
        app.post('/add', async (req, res) => {
            const add = req.body;
            const result = await addCollection.insertOne(add);
            res.send(result);
        });

        // get added API
        app.get('/add', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = addCollection.find(query);
            const added = await cursor.toArray();
            res.send(added);
        })

        // jwt created
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.send({ token });
        })
    }

    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('programming sage running')
});

app.listen(port, () => {
    console.log(`programming sage running on ${port}`);
});