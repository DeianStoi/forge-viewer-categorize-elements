var express = require('express');
var router = express.Router();

var axios = require('axios');

// Translate file for the viewer
router.get('/translate/:urn', function (req, res) {
    // If the file is too big -> zip (the file name has to be explicit)
    
    var urn = req.params.urn;
    var format_type = 'svf';
    var format_views = ['3d'];

    axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/modelderivative/v2/regions/eu/designdata/job',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: JSON.stringify({
            'input': {
                'urn': urn,
            },
            'output': {
                'formats': [
                    {
                        'type': format_type,
                        'views': format_views,
                        'advanced': {
                            'switchLoader': true

                      }
                    }
                ]
            }
        })
    })
        .then(function (response) {
            res.redirect('/viewer.html?urn=' + urn);
        })
        .catch(function (error) {
            res.send('Failed to translate object! ' + error);
        });
});

// Delete translation
router.get('/delete/translation/:urn', function(req,res){

    var urn = req.params.urn;

    axios({
        method: 'DELETE',
        url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/'+ urn +'/manifest',
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
        .then(function (response) {
            res.redirect('/main.html');
        })
        .catch(function (error) {
            res.send('Failed to delete the translation! ' + error);
        });
});

module.exports = router;