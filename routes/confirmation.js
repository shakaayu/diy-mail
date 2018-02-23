
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');



const User = require('../models/user');
const Token = require('../models/token');

router.post('/confirmation/:id', function (req, res, next){
    console.log('confirm');

        var errors = req.validationErrors();
    if (errors) return err;
    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return err;
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return console.log('error');
            if (user.isVerified) return console.log({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if(err) throw err;
                else
                { 
                   res.redirect('/');
                 }
                           console.log("The account has been verified. Please log in.");
            });
        });
    });
    });
module.exports = router;