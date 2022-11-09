const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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