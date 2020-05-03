const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();

// retrieve latest micro-post
router.get('/', async (req, res) => {
  const collection = await loadMicroPostsCollection();
  res.send(
    await collection.find({}).toArray()
  );
});

// insert a micro-post
router.post('/', async (req, res) => {
  const collection = await loadMicroPostsCollection();
  await collection.insertOne({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    createdAt: new Date(),
  })
  res.status(200).send();
})

async function loadMicroPostsCollection() {
  const client = await MongoClient.connect('mongodb://localhost:27017/');
  return client.db('micro-blog').collection('micro-posts');
}

module.exports = router;
