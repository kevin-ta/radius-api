var express     = require('express'),
    router      = express.Router(),
    bodyParser  = require('body-parser'),
    VerifyRole = require('../auth/VerifyRole'),
    User        = require('../models/User');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Added VerifyRole middleware to make sure only an administrator can access these routes

// Get all users
router.get('/', VerifyRole, function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There is a problem finding the users.");
        res.status(200).send(users);
    });
});

// Get user
router.get('/:id', VerifyRole, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There is a problem finding the user.");
        if (!user) return res.status(404).send("User not found.");
        res.status(200).send(user);
    });
});

// Add new user
router.post('/', VerifyRole, function (req, res) {
    User.create({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            firstname : req.body.firstname,
            lastname : req.body.lastname
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There is a problem creating the user to the database.");
            res.status(200).send(user);
        });
});

// Update user
router.put('/:id', VerifyRole, function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There is a problem updating the user.");
        res.status(200).send(user);
    });
});

// Delete user
router.delete('/:id', VerifyRole, function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There is a problem deleting the user.");
        res.status(200).send("User: "+ user.username +" has been deleted.");
    });
});

module.exports = router;