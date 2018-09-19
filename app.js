const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

const Product = require('./routes/product')
const User = require('./routes/user')

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({extended: false, limit:'50mb'}))
app.use(morgan('dev'))

// create router
app.use('/product', Product)
app.use('/user', User)

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin-, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
})

app.use(function(req, res, next){
    const error = new Error("Not Found")
    error.status(400)
    next(error)
})

app.use(function(error, req, res, next){
    res.status(error.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
})

app.listen(4000)

module.exports = app;