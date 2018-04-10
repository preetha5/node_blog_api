'user strict';

const chai = require('chai');
const chaiHttp =  require('chai-http');
const mongoose = require('mongoose');
const faker =  require('faker');
const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');
const {blogPosts} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);
chai.use(require('chai-moment'));

chai.use(require('chai-datetime'));

//Generate blog data
function generateBlogData(){
    const data  = 
     {
        title: faker.random.words(),
        author: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        },
        content: faker.lorem.words(),
        created: Date.now()
    }
    console.log("generating data.now() ", data.created);
    return data;
}

//Seed database with 10 blogs to begin with
function seedBlogPosts(){
    const seedData = [];
    console.info('Seeding blog posts database..');
    for(i=1; i<10; i++){
        seedData.push(generateBlogData());
    }
    return blogPosts.insertMany(seedData);
}

//teardownDB
function teardownDB(){
    console.log('deleting database..');
    return mongoose.connection.dropDatabase();
}

describe('Blogs API tests', function(){
    before(function(){
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function(){
        return seedBlogPosts();
    });

    afterEach(function(){
        return teardownDB();
    });

    after(function(){
        return closeServer();
    });

    describe('GET endpoint testsuite', function(){
        it('should return all existing blogs', function(){
            let res;
            return chai.request(app)
                .get('/posts')
                .then(function(_res){
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.posts).to.have.length.of.at.least(1);
                    return blogPosts.count();
                })
                .then(function(count){
                    expect(res.body.posts).to.have.lengthOf(count);
                });
        });//End test for checking all posts in GET

        it('should return block with the right fields', function(){
            let resPost;
            return chai.request(app)
                .get('/posts')
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res.body.posts).to.be.a('array');
                    res.body.posts.forEach(item => {
                        expect(item).to.be.a('object');
                        expect(item).to.include.keys(['id', 'title', 'content', 'author', 'created']);
                    });
                    resPost = res.body.posts[0];
                    return blogPosts.findById(resPost.id);
                })
                .then(function(dbPost){
                    expect(resPost.id).to.be.equal(dbPost.id);
                    expect(resPost.title).to.be.equal(dbPost.title);
                    expect(resPost.content).to.be.equal(dbPost.content);
                    expect(resPost.author).to.contain(dbPost.author.firstName);
                    expect(resPost.author).to.contain(dbPost.author.lastName);
                    expect(resPost.created).to.be.sameMoment(dbPost.created);
                })
        }); //End test for checking right fields in GET
    }); //End GET endpoint tests

    describe('POST endpoint testsuite', function(){
        it('should add a new post' , function(){
            const newPost = generateBlogData();
            return chai.request(app)
                .post('/posts')
                .send(newPost)
                .then(function(res){
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(['id', 'title', 'content', 'author', 'created']);
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.title).to.be.equal(newPost.title);
                    expect(res.body.content).to.be.equal(newPost.content);
                    //expect(res.body.created).to.be.sameMoment(newPost.created);
                    expect(res.body.author).to.contain(newPost.author.firstName);
                    return blogPosts.findById(res.body.id);
                })
                .then(function(dbPost){
                    expect(dbPost.name).to.equal(newPost.name);
                    expect(dbPost.title).to.equal(newPost.title);
                    expect(dbPost.content).to.equal(newPost.content);
                    expect(dbPost.author.firstName).to.equal(newPost.author.firstName);
                    expect(dbPost.author.lastName).to.equal(newPost.author.lastName);
                   // expect(dbPost.created).to.equalTime(newPost.created);
                });
        });//End IT should add a new post test
    }); //End POST testsuite

    describe('PUT Endpoint tests', function(){
        it("should update an existing post in the db", function(){
            const updatedPost = {
                title : "Alphabets",
                content : "A, B and C"
            };
            return blogPosts.findOne()
                .then(function(res){
                    updatedPost.id = res.id;

                    return chai.request(app)
                        .put(`/posts/${updatedPost.id}`)
                        .send(updatedPost)
                        .then(function(res){
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.a('object');
                            return blogPosts.findById(updatedPost.id);
                        })
                        .then(function(dbPost){
                            expect(dbPost.title).to.be.equal(updatedPost.title);
                            expect(dbPost.content).to.be.equal(updatedPost.content);
                    });
                })
        }); //End should update an existing post test
    }); //End Describe test for PUT endpoint

    describe('DELETE endpoint test', function(){
        it("should delete a blog from the database by ID", function(){
            let delPost;
            return blogPosts
                .findOne()
                .then(function(res){
                    delPost = res;
                    return chai.request(app)
                        .delete(`/posts/${delPost.id}`);
                })
                .then(function(res){
                    expect(res).to.have.status(204);
                    return blogPosts.findById(delPost.id);
                })
                .then(function(dbPost){
                    expect(dbPost).to.be.null;
                });
        });//End IT should delete a blog from db test

    }); //END describe test for delete endpoint
});//END all testsuites