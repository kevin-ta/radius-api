var jwt    = require('jsonwebtoken'),
    config = require('../../config.json');

function verifyRole(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {   
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if (decoded.role != 'admin') return res.status(500).send({ auth: false, message: 'Unauthorized user.' });
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyRole;