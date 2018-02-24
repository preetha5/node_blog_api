'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {blogPosts} = require('./models');
const app = express();
app.use(bodyParser.json());

//GET requests
app.get('/posts', (req, res) => {
  blogPosts.find()
  .limit(10)
  .then(posts => {
    res.json({
      posts: posts.map((post) => post.serialize())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  });
});

//GET request with an ID
app.get('/posts/:id', (req, res) => {
  blogPosts.findById(req.params.id)
  .then(post => res.json(post.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  });
});

//POST requests
app.post('/posts', (req,res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i< requiredFields.length; i++){
    const field = requiredFields[i];
    if (!(field in req.body)){
      const message = `Error: missing ${field} in req.body`;
      return res.status(400).send(message);
    }
  }
  blogPosts
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    })
    .then(blog => res.status(201).json(blog.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Internal server error"});
    });
});

//PUT requests
app.put('/posts/:id', (req,res) =>{
  //make sure id in the param and req.body match
  if(!(req.params.id && req.body.id && req.body.id === req.params.id)){
    const message = 
      `Request path id (${req.params.id}) and Request body ID (${req.body.id}) should match`;
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateFields = ['title', 'content', 'author'];
  updateFields.forEach(field =>{
    if (field in req.body){
      toUpdate[field] = req.body[field];
    }
  });

  blogPosts.findByIdAndUpdate(req.params.id, { $set: toUpdate}, {new: true})
  .then(updatedPost => res.status(200).json(updatedPost.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  });
});

//DELETE post
app.delete('/posts/:id', (req,res) =>{
  blogPosts
    .findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//Catch all for requests
app.use('*', (req,res) =>{
  res.status(404).json({message: 'Not Found'});
})


let server;

function runServer(databaseURL, port=PORT){
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, err => {
      if(err){
        reject(err);
      };
      server = app.listen(port, ()=>{
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer(){
  return mongoose.disconnect()
    .then(()=>{
      return new Promise((resolve, reject) =>{
        console.log('closing server');
        server.close(err => {
          if(err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
}

if (require.main === module){
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};