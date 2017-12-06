var app  = require('./app'),
    port = process.env.PORT || 5000;

app.listen(port, function(){
    console.log('Server listening on port ' + port);
});