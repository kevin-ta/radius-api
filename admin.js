var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    User     = require('./app/models/User');
try {
    mongoose.connect('mongodb://localhost:27017/radius', {useMongoClient: true});
} catch(e) {
    throw new Error('Database Connection failed:' + e);
}

var hashedPassword = bcrypt.hashSync('admin', 8);

User.create({
    username : 'admin',
    email : 'admin@radius.com',
    password : hashedPassword,
    firstname : 'admin',
    lastname : 'admin'
});

mongoose.connection.close();