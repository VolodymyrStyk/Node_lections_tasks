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
    res.render('index', {name: 'User'});
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    const {login, password} = req.body;
    const allUsers = await getUsersDB();
    const findUser = await checkInputedData(login,password,allUsers);
    if (findUser){
        console.log(34, findUser);
    }
    if(!findUser){
        res.redirect('/error', function (req, res) {
            res.send('This login exist in system');
        });
    }


});
app.get('/error', (req, res) => {
    res.render('error');
});


app.get('/register', async (req, res) => {
    const {login, password} = req.body;
    const newUserExist = await _isNewUser(login);

    if (newUserExist) {
        res.redirect('/error', function (req, res) {
            res.send('This login exist in system');
        });
    }
    console.log(33, newUserExist);
    console.log(login, newUserExist);
});


app.get('/users', (req, res) => {
    res.json('users');
});


function _wrUserToDataBase(user) {
    return new Promise(resolve => {
        let response;
        fs.readFile(dBPath, (err, data) => {
            if (err) {
                console.log('* -Can not read File: ', err);
                return;
            }
            const users = (!data || data.toString() === '') ? _dataInit() : JSON.parse(data);
            const isExist = _checkUser(users, user.login);
            console.log('wr ' + isExist);
            if (!isExist) {
                fs.writeFile(dBPath, JSON.stringify(users), (err) => {
                    if (err) {
                        console.log(57, err);
                    }
                });
                response = 'User EXIST NOK';
            }
            if (isExist) {
                response = 'Hello New User';
            }
        })
        return response;
    })
}

async function _checkUser(login) {


}


function _isNewUser(inputLogin) {
    return new Promise((resolve, reject) => {
        fs.readFile(dBPath, (err, data) => {
            if (err) {
                reject(err);
            }
            const users = !data || data.toString() === '' ? _dataInit() : JSON.parse(data);
            let loginExist = false;
            users.forEach(({login}) => {
                if (login === inputLogin) {
                    loginExist = true;
                }
            });
            resolve(loginExist);
        })
    })
}


app.get('/ping', (req, res) => {
    res.end('pong');
});

function _dataInit() {
    return [{"login": "login", "password": "password"}];
}

function checkInputedData(login='',pass='',allUsers=[]){
    return new Promise((resolve, reject) => {
        const found = allUsers.find(exist => (exist.login === login && exist.password === pass ));
        resolve(found);
    })
}


function getUsersDB() {
    return new Promise((resolve, reject) => {
        fs.readFile(dBPath, (err, data) => {
            if (err) {
                reject(err);
            }
            const users = !data || data.toString() === '' ? _dataInit() : JSON.parse(data);
            resolve(users);
        })
    })
}
