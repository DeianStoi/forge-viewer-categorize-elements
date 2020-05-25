var express = require('express');
var router = express.Router();

var axios = require('axios');
var querystring = require('querystring');

global.token = '';

router.get('/token', function(req, res){

    var scopes = 'data:read data:write data:create bucket:create bucket:read bucket:delete';

    axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
            client_id: process.env.FORGE_CLIENT_ID,
            client_secret: process.env.FORGE_CLIENT_SECRET,
            grant_type: 'client_credentials',
            scope: scopes
        })
    })

        .then((response) => {
            token = response.data.access_token;
            res.redirect('/main.html');
        })

        .catch((error) => {
            res.send('Failed to authenticate. ' + error);
        });

});

router.get('/token/public', function (req, res) {

    // Public token with a scope to view only
    var scopes = 'viewables:read';

    axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
            client_id: process.env.FORGE_CLIENT_ID,
            client_secret: process.env.FORGE_CLIENT_SECRET,
            grant_type: 'client_credentials',
            scope: scopes
        })
    })
        .then(function (response) {
            res.json({ access_token: response.data.access_token, expires_in: response.data.expires_in });
        })
        .catch(function (error) {
            res.send('Failed to authenticate. ' + error);
        });
});

module.exports = router;