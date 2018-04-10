'use strict';

const mongoose = require('mongoose');

const blogpostsSchema = mongoose.Schema({
    title: {type: String, required: true},
    author:{
        firstName:{type:String, required: true},
        lastName:{type:String, required: true}
    },
    content:{type: String, required: true},
    created:{type:Date, default: Date.now}
});

//Create virtual property for authorName
blogpostsSchema.virtual('authorName')
    .get( function(){
        return `${this.author.firstName} ${this.author.lastName}`.trim();
    });

//Create an instance method for all calls to the model
blogpostsSchema.methods.serialize = function(){
    return {
        id: this._id,
        title: this.title,
        author: this.authorName,
        content: this.content,
        created: this.created
    };
};

const blogPosts = mongoose.model('blogPosts', blogpostsSchema);
module.exports = {blogPosts};