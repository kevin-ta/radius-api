var express     = require('express'),
    router      = express.Router(),
    bodyParser  = require('body-parser'),
    VerifyAuth  = require('./VerifyAuth'),
    VerifyRole  = require('./VerifyRole'),
    User        = require('../models/User'),
    jwt         = require('jsonwebtoken'),
    bcrypt      = require('bcrypt'),
    config      = require('../../config.json');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/login', function(req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');        
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token });
    });
});

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

router.post('/register', VerifyRole, function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword,
        firstname : req.body.firstname,
        lastname : req.body.lastname
    }, 
    function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.");
        var token = jwt.sign({ id: user._id }, config.secret, {
           expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token });
    });
});

router.get('/me', VerifyAuth, function(req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

module.exports = router;