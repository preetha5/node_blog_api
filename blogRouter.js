const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//Add some default blog posts on load
BlogPosts.create('welcome to node', 'intro to nodeJS', 'preetha');
BlogPosts.create('REST API methods', 'Create, Read, Update and Delete', 'Amy');

//GET
router.get('/', (req, res) => {
    console.log('getting blogs');
    res.json(BlogPosts.get());
});

//POST
router.post('/', jsonParser ,(req, res) => {
    //check for required fields of blog title, content and author
    const requiredFields = ['title', 'content' , 'author'];
    for (let i=0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message  = `Missing field ${field} in request body`;
            console.log(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

//DELETE
router.delete('/:id', (req, res) => {
    console.log(`deleting item ${req.params.id}`);
    BlogPosts.delete(req.params.id);
    res.status(204).end();
});

//PUT (Update)
router.put('/:id', jsonParser, (req, res) => {
    //check for required fields of blog title, content and author
    const requiredFields = ['title', 'content' , 'author'];
    for (let i=0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message  = `Missing field ${field} in request body`;
            console.log(message);
            return res.status(400).send(message);
        }
    }
    //compare param and body Id's
    if(req.params.id !== req.body.id){
        const message = `Mismatched ID : Param ID (${req.params.id}) and request body id
        (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    const updatedItem  = {
        id: req.params.id,
        title : req.body.title,
        content : req.body.content,
        author :  req.body.author,
        publishDate :  req.body.publishDate
    }
    BlogPosts.update(updatedItem);
    res.status(204).end();
})

module.exports =  router;