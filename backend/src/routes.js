const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

// const { AUTH0_CLIENT_ID, AUTH0_DOMAIN, MONGODB_URL } = process.env;
// const MONGODB_URL = 'mongodb://revInventory:Future2030#@revolution-inventory.cluster-cylxupi9olun.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'

// retrieve latest micro-post
router.get('/', async (req, res) => {
  // const collection = await loadMicroPostsCollection();
  const data = await getAllItems('inventory');
  console.log(data);
  res.send(data);
});

// insert a micro-post
router.post('/', async (req, res) => {
  console.log(req);
  console.log(res);
  // const collection = await loadMicroPostsCollection();
  // await collection.insertOne({
  //   name: req.body.name,
  //   image: req.body.image,
  //   price: req.body.price,
  //   createdAt: new Date(),
  // })

  let date = new Date().toDateString();

  const item = {
    id: 'INV_' + Math.random(),
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    createdAt: date,
  }
  await putItem('inventory', item);
  res.status(200).send();
})

async function loadMicroPostsCollection() {
  const client = await MongoClient.connect(MONGODB_URL);
  // const client = await MongoClient.connect('mongodb://localhost:27017/');
  return client.db('micro-blog').collection('micro-posts');
}

async function putItem(table, item) {
  return new Promise((resolve,reject) => {
    const params = {
      TableName: table,
      Item:item
    }

    dynamodb.put(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
async function getAllItems (table) {
  return new Promise((resolve,reject) => {
    console.log('RUNNING GET ALL');

    const params = {
      TableName: table
    }

    dynamodb.scan(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(data);
        resolve(data.Items)
      }
    })
  })
}
async function getItem (table, idkey) {
  return new Promise((resolve,reject) => {
    const params = {
      TableName: table,
      Key: {
        [idkey]: id
      }
    }

    dynamodb.get(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.Item)
      }
    })
  })
}


module.exports = router;
