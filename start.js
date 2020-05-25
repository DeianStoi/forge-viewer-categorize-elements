var express = require('express');
var bodyParser = require('body-parser');

require('dotenv').config();

if (process.env.FORGE_CLIENT_ID == null || process.env.FORGE_CLIENT_SECRET == null) {
    console.warn('FORGE_CLIENT_ID and FORGE_CLIENT_SECRET must be defined in the .env file!');
    return;
}

var app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/api/forge/oAuth2', require('./routes/oAuth2'));
app.use('/api/forge/dataManagement', require('./routes/dataManagement'));
app.use('/api/forge/modelDerivative', require('./routes/modelDerivative'));
app.use('/others', require('./routes/others'));

app.listen(3000, function(){
    console.log('Server listening on port ',3000);
  });