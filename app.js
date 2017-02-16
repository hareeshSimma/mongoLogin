var express = require('express');
var bodyParser = require('body-parser');
// var db = require('./db/connection');\
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hareesh');
var app = express();
var urlbodyParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('styles'));
var newemp = new mongoose.Schema({
    Uname: { type: String, unique: true },
    Password: String,
    dob: Date,
    mobileno: Number

});
var model = mongoose.model('studentdet', newemp);


app.set('view engine', 'ejs');
app.get('/', function(req, resp) {
    resp.render('login');
});

//registration module

app.get('/register', function(req, resp) {
    resp.render('register', { msg: "" });
});

app.post('/Register', urlbodyParser, function(req, resp) {
    if (req.body.Uname == "" || req.body.Password == "" || req.body.dob == "" || req.body.mobileno == "") {
        resp.end("Please Fill The All Fields........!");
    } else {


        var emp = model(req.body).save(function(err, data) {
            if (err) {

                resp.render('register', { msg: "user already existes....." })
            } else {

                resp.render('login')
                console.log(data);
                console.log("Resgister successfully......");
            }
        })


    }


});

//login module

app.post('/Home', urlbodyParser, function(req, resp) {

    if (req.body.uname == "" || req.body.pswd == "") {
        resp.end("Please Fill The User Name and Password Fields........!");
    } else {
        var det = model.find({ $and: [{ 'Uname': req.body.uname }, { 'Password': req.body.pswd }] }, function(err, data) {
            console.log(JSON.stringify(data));
            if (err) {
                throw err
            } else {
                if (data == "") {
                    resp.end("Invalid User Name and Password...");
                } else {
                    resp.render('home')
                    console.log("User login Successfully......");
                }
            }
        })

    }

});

//navigation tabs

app.get('/home', function(req, resp) {
    resp.render('home');
});
app.get('/about', function(req, resp) {
    resp.render('aboutus');
});
app.get('/contactus', function(req, resp) {
    resp.render('contactus');
});
app.get('/detilals', function(req, resp) {
    model.find(function(err, data) {
        if (err) {
            throw err
        } else {
            console.log(JSON.stringify(data));


            resp.render('detials', { data: data });
        }
    });

});

app.get('/services', function(req, resp) {
    resp.render('services');
});






app.listen(3001);