require('./models/db');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const config = require("./config");
var cookieParser = require('cookie-parser');
const burclarınuyumuControllers = require('./controllers/burclarınuyumuControllers');




var app = express();

app.set("api_secret_key", config.api_secret_key);





app.set('views', path.join(__dirname, '/views/'));
app.use('/assets',express.static('assets'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use(cookieParser());



app.listen(3000, () => {
    console.log('Bağlanılan port : 3000');
})

app.use('/', burclarınuyumuControllers);
