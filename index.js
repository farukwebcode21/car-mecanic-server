const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;
// Middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cdxsv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET SINGLE SERVICES
        app.get('/services/:id', async (req, res) => {
            const id = req.params;
            // console.log('Greetin specifice', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit th post', service);
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        });

        //  DELETE API
        app.delete('/services/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Running Server http://localhost:${port}`);
});
