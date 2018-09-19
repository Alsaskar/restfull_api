const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const conn = require('../config/database.js')

router.get('/', function(req, res){
    res.send("Hello User")
})

// register user
router.post('/register', function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    conn.query('SELECT email, password FROM user WHERE email = "'+email+'"', function(error, cek){
        if(cek.length > 0){
            res.json({
                message: "Email sudah terdaftar !"
            })
        }else{
            bcrypt.hash(password, 15, function(err_pass, hash) {
                conn.query('INSERT INTO user(email, password) VALUES("'+ email +'", "'+ hash +'")', function(err, result){
                    if(err) throw err;
            
                    res.json({
                        message: "Anda berhasil mendaftar"
                    })
                })
            });
        }
    })
})

// login user
router.post('/login', function(req, res){

    const payload = {
        jti: 'JWT ID',
        email: req.body.email,
    }

    const email = req.body.email;
    const password = req.body.password;
    const token = jwt.sign(payload, 'secret', {expiresIn: '1day'});

    conn.query('SELECT email, password FROM user WHERE email = "'+email+'"', function(err, result){
        if(err) throw err;

        if(result.length < 1){
            res.json({
                message: 'Email belum terdaftar !'
            })
        }else{
            bcrypt.compare(password, result[0].password, function(error, response) {
                if(response){
                    res.json({
                        message: 'Anda berhasil login',
                        token: token
                    })
                }else{
                    res.json({
                        message: 'Anda gagal login'
                    })
                }
            });
            
        }
    })
})

module.exports = router;