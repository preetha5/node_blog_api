const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('BlogPosts', function(){
    before(function(){
       return runServer();
    });

    after(function(){
        return closeServer();
    });

    //Test for GET
    it("should return blogs on GET", function(){
        return chai.request(app)
                .get('/blog-posts')
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.be.greaterThan(1);

                    const expectedKeys = ['title', 'content', 'author'];
                    res.body.forEach(item => {
                        expect(item).to.include.keys(expectedKeys);
                });
        });
    });

    //Test for POST
    it("should add new blog on POST", function(){
        const newBlog = {
            title:"Alphabets",
            content:"learn your A, B and C",
            author: "Arvind"
        };
        return chai.request(app)
            .post('/blog-posts')
            .send(newBlog)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.not.equal(null);
                const expectedKeys = ['title', 'content', 'author', 'publishDate'];
                expect(res.body).to.include.keys(expectedKeys);
                expect(res.body).to.deep.equal(Object.assign(newBlog, {id: res.body.id, publishDate: res.body.publishDate}));
            });
    });

    //Test for ERROR case for POST
    it("should return error for missing required values in POST", function(){
        const badPost = {
            title:"Alphabets"
        };
        return chai.request(app)
                .post('/blog-posts')
                .send(badPost)
                .catch(function(res){
                    expect(res).to.have.status(400);
                });
    })
    //Test for PUT
    it("should update blog on PUT", function(){
        const updateBlog = {
            title:"Alphabets",
            content:"learn your A, B and C",
            author: "Preetha",
            publishDate:"01-01-2018"
        };
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                updateBlog.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${res.body[0].id}`)
                    .send(updateBlog);
            })
            .then(function(res){
                expect(res).to.have.status(204);
            });
    })

    //Test for DELETE
    it("should delete blog item on DELETE", function(){
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function(res){
                expect(res).to.have.status(204);
            })
    })
});