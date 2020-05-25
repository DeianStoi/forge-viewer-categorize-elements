var express = require('express');
var router = express.Router();

const xml2js = require('xml2js');
const fs = require('fs');

// Read XML-File
router.get('/read/xml', function(req,res){

    var xml_name = '/../xml/properties.xml';
    var xml_string = fs.readFileSync(__dirname + xml_name, 'utf8');

    const parser = new xml2js.Parser({ attrkey: 'ATTR'});
    parser.parseString(xml_string, function(error, result) {
        if(error === null) {
            res.json({result});
        }
        else {
            res.send('Failed to read the XML-File! ' + error);
        }
    });
});

module.exports = router;