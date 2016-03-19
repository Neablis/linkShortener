var exphbs = require('express-handlebars');
var express = require('express');
var bodyParser = require('body-parser')

var linkFunctions = require('./link').link;

var app = express();



app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'));

app.get('/home', function (req, res) {
    res.render('index', {test: 'test'});
});

app.post('/link', function (req, res) {
    var link = req.body.link;

    if (link) {
        linkFunctions.setLink(link, function (err, code) {
            res.json({code: code});
        });
    } else {
        res.status(500).send("failed");
    }
});

app.get('/link/:code', function (req, res) {
    var code = req.params.code;
    linkFunctions.getLinkByCode(code, function (err, link) {
        res.json({link: link});
    });
});

app.get('/:code', function (req, res, next) {
    var code = req.params.code;

    if (code.split('.').length !== 1) {
        return next();
    }

    if (code) {
        linkFunctions.getLinkByCode(code, function (err, link) {
            if (!err && link !== null) {
                return res.redirect(link);
            } else {
                return res.status(500).send(err);
            }
        });
    } else {
        return res.status(400).send("Missing code");
    }
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});