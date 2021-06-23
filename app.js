const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');

const app = express();

app.listen(3000, () => {
    console.log('App listen 3000');
});

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'static'));
app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({
    defaultLayout: false
}));

app.get('/', (req, res) => {
    res.render('index', {name: 'Volodymyr'})
});

app.get('/ping', (req, res) => {
    res.end('pong');
});
app.get('/', (req, res) => {
    res.json('Main Page');
});
app.get('/register', (req, res) => {
    res.json('register');
});
app.get('/login', (req, res) => {
    res.json('login');
});
app.get('/users', (req, res) => {
    res.json('users');
});

