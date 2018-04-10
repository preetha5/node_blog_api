const express = require('express');
const app = express();//get access to express functions and methods by instantiating
//variables available to the pug templates
app.locals.hobbies = ["gardening", "hiking", "relaxing in the beach"]
app.locals.budgets = {
    home:300,
    gas: 400,
    groceries: 100
};

app.use(express.static('public'));

app.set('view engine', 'pug');

app.get('/', (req,res) =>{
    res.render('index',{name:'Preetha'});
});

app.get('/account', (req,res) =>{
  res.render('account');
});

//Catch 404 and fwd to error handler
app.use(function(req,res, next){
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
})

//Error Handler
app.use(function(err, req, res, next){
    //Provide errors only in dev
    res.locals.message = err.message;
    res.locals.error = err;

    //render the error
    res.status(err.status || 500);
   // res.render('error');
});

//app.listen(process.env.PORT||3000);
app.listen(3000, () => {
    console.log("App is listening on port 3000");
});