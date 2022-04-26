const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express(); 
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ws9op.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        const productsCollection = client.db("EmaJohn").collection("products");

        app.get('/products', async(req, res) => {
            console.log(req.query);
            const page = req.query.page;
            const size = req.query.size;

            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            // const result = await cursor.limit(10).toArray();
            res.send(products)
        })

        app.get('/productCount', async(req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const count = await cursor.count();
            res.send({count});
            // res.json(count) 
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Database connected')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})