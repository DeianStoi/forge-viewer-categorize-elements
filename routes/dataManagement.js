var express = require('express');
var router = express.Router();

var axios = require('axios');
var fs = require('fs');
var multer = require('multer');
var Buffer = require('buffer').Buffer;

// Get all buckets
router.get('/getBuckets', function(req, res){

    axios({
        method: 'GET',
        url: 'https://developer.api.autodesk.com/oss/v2/buckets',
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    .then(function(response){
        var buckets = response.data.items;
        res.json({buckets});
    })
    .catch(function(error){
        res.send('Failed to get buckets. ' + error);
    });
})

// Create a bucket
router.get('/bucket/create/:bucketKey', function (req, res) {

    var bucketKey = req.params.bucketKey;
    var policyKey = 'transient';

    axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/oss/v2/buckets',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        data: JSON.stringify({
            'bucketKey': bucketKey,
            'policyKey': policyKey
        })
    })
        .then(function (response) {
            res.redirect('/main.html');
        })
        .catch(function (error) {
            if (error.response && error.response.status == 409) {
                res.send('Bucket already exists, try again!. ' + error);
            }
            res.send('Failed create a new bucket. Possible issue: name is not allowed, please try another one! ' + error);
        });
});

// Get all objects of a bucket
router.get('/bucket/objects/:bucketkey', function (req, res) {

    var BucketKey = req.params.bucketkey;

    axios({
        method: 'GET',
        url: 'https://developer.api.autodesk.com/oss/v2/buckets/' + BucketKey + '/objects',
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
        .then(function (response) {
            var objects = response.data.items;

            for (var i = 0; i < objects.length; i++){
                objects[i].objectId = objects[i].objectId.toBase64();
            }

            res.json({objects});
        })
        .catch(function (error) {
            res.send('Failed to get objects of a bucket. ' + error);
        });
});

// Upload file to bucket
var upload = multer({ dest: 'tmp/' }); // Save file into local /tmp folder
router.post('/bucket/upload/:bucketKey', upload.single('fileToUpload'), function (req, res) {

    var bucketKey = req.params.bucketKey;

    fs.readFile(req.file.path, function (err, filecontent) {
        axios({
            method: 'PUT',
            url: 'https://developer.api.autodesk.com/oss/v2/buckets/' + bucketKey + '/objects/' + encodeURIComponent(req.file.originalname),
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Disposition': req.file.originalname,
                'Content-Length': filecontent.length
            },
            data: filecontent,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
            .then(function (response) {
                var urn = response.data.objectId.toBase64();
                res.redirect('/api/forge/modelDerivative/translate/' + urn);
            })
            .catch(function (error) {
                res.send('Failed to upload file to bucket. ' + error);
            });
    });
});

// Delete object
router.get('/delete/object/:bucketKey/:objectKey', function(req,res){

    var currBucketKey = req.params.bucketKey;
    var currObjcetKey = req.params.objectKey;

    axios({
        method: 'DELETE',
        url: 'https://developer.api.autodesk.com/oss/v2/buckets/'+currBucketKey+'/objects/'+currObjcetKey,
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
    .then(function(response){
        res.redirect('/main.html');
    })
    .catch(function(error){
        res.send('Failed to delete the object! ' + error);
    })
});

// Delete bucket
router.get('/delete/bucket/:bucketKey', function(req,res){

    var currbuck = req.params.bucketKey;

    axios({
        method: 'DELETE',
        url: 'https://developer.api.autodesk.com/oss/v2/buckets/'+ currbuck,
        headers:{
            Authorization: 'Bearer ' + token
        },
    })
    .then(function(response){
        res.redirect('/main.html');
    })
    .catch(function(response){
        res.send('Failed to delete the bucket! ' + error);
    })
});

String.prototype.toBase64 = function () {
    return Buffer.from(this).toString('base64');
};

module.exports = router;