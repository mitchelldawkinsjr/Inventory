const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const Crypto = require("crypto");

// retrieve latest micro-post
router.get('/', async (req, res) => {
  // const collection = await loadMicroPostsCollection();
  const data = await getAllItems('inventory');
  console.log(data);
  res.send(data);
});

// insert a micro-post
router.post('/', async (req, res) => {
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

// insert a image
router.put('/', async (req, res) => {
  await saveImg(req.body.name, req.body.data)
  res.status(200).send();
})

router.get('/uploader', async (req, res) => {
  var fileId = Crypto.randomBytes(20).toString('hex').toUpperCase();
  var prefix = "assets/img/uploads/";
  var newFileName = prefix+fileId;//req.query.fileName;

  var s3 = new AWS.S3();
  var s3_params = {
    Bucket: 'revolution-inventory',
    Key: newFileName,
    Expires: 60,
    ContentType: req.query.fileType,
    ACL: 'public-read-write'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
      console.log(err);
    }
    else{
      var return_data = {
        signedRequest: data,
        uploadURL: 'https://'+s3_params.Bucket+'.s3.amazonaws.com/'+s3_params.Key,
        downloadURL: 'http://'+s3_params.Bucket+'.s3-website-us-east-1.amazonaws.com/'+s3_params.Key,
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });
  // res.status(200).send();
  // res.send(data);
});


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
    const params = {
      TableName: table
    }

    dynamodb.scan(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
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
async function saveImg (name, data) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'revolution-inventory',
      Key: `assets/img/uploads/${name}`,
      Body: Buffer.from(data.dataURL, 'base64'),
      ContentEncoding: 'base64',
      ContentType: 'image/png'
    }
    s3.putObject(params, (err,data) => {
      if (err) {
        reject(err)
      } else {
        resolve(`https://revolution-inventory.s3.amazonaws.com/${params.Key}`)
      }
    })
  })
}

module.exports = router;
