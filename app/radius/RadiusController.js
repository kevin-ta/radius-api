var express     = require('express'),
    app         = express(),
    router      = express.Router(),
    bodyParser  = require('body-parser'),
    VerifyAuth = require('../auth/VerifyAuth'),
    connection  = app.get('connection');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Added VerifyAuth middleware to make sure only an authenticated user can access these routes

// Get all RADIUS users
router.get('/users', VerifyAuth, function (req, res) {
    var id = req.params.id;
    connection.query('SELECT * from radcheck', function(err, rows, fields) {
        if (!err) {
            if (rows.length != 0) {
                res.jsonp(rows);
            } else {
                res.jsonp({result: 'error'});
            }
        } else {
            res.status(400).send(err);
        }
    });
});

// Get RADIUS user
router.get('/users/:id', VerifyAuth, function (req, res) {
    var id = req.params.id;
    connection.query('SELECT * from radcheck where id = ?', [id], function(err, rows, fields) {
        if (!err) {
            if (rows.length != 0) {
                res.jsonp(rows[0]);
            } else {
                res.jsonp({result: 'error'});
            }
        } else {
            res.status(400).send(err);
        }
    });
});

// Add RADIUS user
router.post('/users', VerifyAuth, function (req, res) {
    var response = [];
    if (
        typeof req.body.username !== 'undefined' && 
        typeof req.body.password !== 'undefined'
    ) {
        var username = req.body.username, password = req.body.password;
        connection.query('INSERT INTO radcheck (username, attribute, op, value) VALUES (?, ?, ?, ?)', 
            [username, "Cleartext-Password", ":=", password], 
            function(err, result) {
                if (!err) {
                    if (result.affectedRows != 0) {
                        res.jsonp({result: 'success'});
                    } else {
                        res.jsonp({result: 'failed'});
                    }
                } else {
                    res.status(400).send(err);
                }
            });
    } else {
        res.jsonp({result: 'failed'});
    }
});

// Edit RADIUS user
router.put('/users/:id', VerifyAuth, function (req, res) {
    var id = req.params.id;
    if (
        typeof req.body.username !== 'undefined' && 
        typeof req.body.password !== 'undefined'
    ) {
        var username = req.body.username, password = req.body.password;
        connection.query('UPDATE radcheck SET username = ?, value = ? WHERE id = ?', 
            [username, password, id], 
            function(err, result) {
                if (!err) {
                    if (result.affectedRows != 0) {
                        res.jsonp({result: 'success'});
                    } else {
                        res.jsonp({result: 'failed'});
                    }
                } else {
                    res.status(400).send(err);
                }
            });
    } else {
        res.jsonp({result: 'failed'});
    }
});

// Delete RADIUS user
router.delete('/users/:id', VerifyAuth, function (req, res) {
    var id = req.params.id;
    connection.query('DELETE FROM radcheck WHERE id = ?', [id], function(err, result) {
        if (!err) {
            if (result.affectedRows != 0) {
                res.jsonp({result: 'success'});
            } else {
                res.jsonp({result: 'failed'});
            }
        } else {
            res.status(400).send(err);
        }
    });
});

module.exports = router;