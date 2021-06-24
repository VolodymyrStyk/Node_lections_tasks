const express = require('express');
const expressHbs = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
const dBPath = path.join(__dirname, 'data_base', 'users.txt');

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
    res.render('login');
});

app.post('/', async (req, res) => {
    const response = await _wrUserToDataBase(req.body);
    await console.log(response);
    await res.json(response);
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


function _wrUserToDataBase(user) {
    let response;
    fs.readFile(dBPath, (err, data) => {
        if (err) {
            console.log('* -Can not read File: ', err);
            return;
        }
        const users = (!data || data.toString() === '') ? _dataInit() : JSON.parse(data);
        const isExist = _checkUser(users, user.login);
        console.log('wr '+isExist);
        if(!isExist){
            fs.writeFile(dBPath, JSON.stringify(users), (err) => {
                if (err) {
                    console.log(57, err);
                }
            });
            response = 'User EXIST NOK';
        }
        if(isExist){
            response = 'Hello New User';
        }
    })
    return response;
}

function _checkUser(users = [], newUserLogin) {
    let response = true;
    users.forEach(({login}) => {
        if (login === newUserLogin) {
            console.log('func - Exist');
            response = false;
        }
    })
    return response;
}

function _dataInit() {
    return [{"login": "login", "password": "password"}];
}

app.get('/ping', (req, res) => {
    res.end('pong');
});
