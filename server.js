var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors')
var moment = require('moment');
var j2xls = require('json2xls-xml')({ pretty: true });
var address, os = require('os'),
    ifaces = os.networkInterfaces();
var portNum = 80;
var data = [];
var fileName = moment().format("M;D;YYYY;H;mm;ss");
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
}));
app.use(cors());
app.use('/', express.static(__dirname + '/'));
fs.writeFile(fileName + ".xlsx", j2xls(data), 'binary', function(err) {
    error(err);
});
fs.writeFile(fileName + ".json", JSON.stringify(data, null, 4), 'binary', function(err) {
    error(err);
});
app.post('/', function(req, res) {
    for (var i = req.body.length - 1; i >= 0; i--) {
        convert(req.body[i])
        data.push(req.body[i])
        console.log(req.body[i])
    }
    fs.writeFile(fileName + ".xlsx", j2xls(data), 'binary', function(err) {
        error(err);
    });
    fs.writeFile(fileName + ".json", JSON.stringify(data, null, 4), 'binary', function(err) {
        error(err);
    });
    res.sendStatus(200);
});
app.get('/api', function(req, res) {
    res.send(JSON.stringify(data, null, 4));
});
app.get('/download', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/force-download', 'Content-disposition': 'attachment; filename=latest.xlsx' });
    res.end(j2xls(data));
});
serverStopper = app.listen(portNum, function() {});
for (var dev in ifaces) {
    var iface = ifaces[dev].filter(function(details) {
        return details.family === 'IPv4' && details.internal === false;
    });
    if (iface.length > 0) address = iface[0].address;
}
console.log(address)

function error(err) {
    if (err) {
        return console.log(err);
    }
}

function convert(obj) { //turns object.arrays into strings
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] instanceof Array) {

                obj[key] = obj[key].toString()
            }
        }
    }
    return obj;
}
