const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();


//middle ware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.etypt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// const uri = `mongodb+srv://emajhon1:WZTIT7101Iu0dn6C@cluster0.etypt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();

        const productCollection = client.db('emajhon').collection('products');

        app.get('/products',async(req,res)=>{
            console.log("query",req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {}
            const cursor = productCollection.find(query);

            let products;

            if(page || size){
                 products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray();
            }

            
            res.send(products)
        })

        app.get('/productCount',async(req,res)=>{
            const count = await productCollection.estimatedDocumentCount();
            res.send({count})
        })


        app.post('/productsByKeys', async(req, res) =>{
            const keys = req.body;
            console.log(keys);
            const ids = keys.map((id) => ObjectId(id));
            const query = {_id: {$in: ids} }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(keys);
            res.send(products);
        })

        

    }
    finally{

    }
}

run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("ema jhon is running")
})


app.listen(port,()=>{
    console.log("ema jhon running on port :" , port);
})
