var express = require('express');
var passport = require('passport');
var flash = require('connect-flash')
var User = require('../models/user');
var Material = require('../models/material');

var Token = require('../models/token');

var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}
module.exports = function(passport){

    router.post('/endpoint', function(req, res){
  var obj = {};
  console.log('body: lol ' + JSON.stringify(req.body));
  res.send(req.body);
});
    
    router.get('/lol', function(req, res) {
    res.render('lol');
});

    /* GET login page. */
    router.get('/', function(req, res) {

        Material.getImages(function(err, materials){

        console.log('data......', materials)
        if(err) throw err;
        // Display the Login page with any flash message, if any
        res.render('index', { user: req.user, message: req.flash('message'), materials });})
    });

    router.get('/login', function(req, res) {
        // Display the Login page with any flash message, if any
        res.render('login', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash : true  
    }));

    /* GET Registration Page */
    router.get('/signup', function(req, res){
        res.render('register',{message: req.flash('message')});
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash : true  
    }));

    router.get('/material', function(req, res){
        if(req.isAuthenticated())
           { res.render('material', { user: req.user});}
        else{
            console.log('log in to continue');
            res.redirect('login');}
    });

    /* GET Home Page */
    router.get('/profile', isAuthenticated, function(req, res){
        res.render('profile', { user: req.user });
    });

    router.get('/lola', function(req, res){
        res.render('lola');
    });
    router.get('/ind2', function(req, res){
        res.render('ind2');
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    
router.post('/resend', function (req, res, next){
     var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
 
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
 
            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: {
             user: 'doityesari2017@gmail.com', pass: 'yesarido2017' } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
});

    return router;
}

// router.get('/', function (req, res, next) {
//     res.render('index', { user : req.user });


// });

// router.get('/register', function(req, res) {
//     res.render('register', { info: null });
// });

// router.get('/lol', function(req, res) {
//     res.render('lol');
// });

// router.post('/register', passport.authenticate(), function(req, res) {
   
//     res.redirect('login')
// });

// router.get('/login', function(req, res) {
//     res.render('login', { user : req.user });
// });

// router.post('/login', passport.authenticate(), function(req, res) {
//     console.log('lol');
//     res.redirect('/');
// });

// router.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
// });

// // =====================================
//     // PROFILE SECTION =====================
//     // =====================================
//     // we will want this protected so you have to be logged in to visit
//     // we will use route middleware to verify this (the isLoggedIn function)
//     router.get('/profile', isLoggedIn, function(req, res) {
//         res.render('profile', {
//             user : req.user // get the user out of session and pass to template
//         });
            

// });

// // 



// // route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }


// router.get('/ping', function(req, res){
//     res.status(200).send("pong!");
// });

// module.exports = router;
