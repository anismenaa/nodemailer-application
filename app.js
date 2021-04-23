require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var path = require('path');


var port = process.env.PORT;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', async (req, res) => {
    // create a mail transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: 'anis menaa <'+process.env.EMAIL+'>',
        to: process.env.EMAIL,
        subject: 'something to say',
        html: '<p>your recieved something from <ul><li>name: '+req.body.name+'</li><li>email: '+req.body.email+'</li><li>message: '+req.body.message+'</li></ul></p>'
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log('there is an error '+ error);
            res.redirect('/')
        } else {
            console.log('everything went fine '+info.response);
            res.redirect('/')
        }
    });
})

app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`);
})