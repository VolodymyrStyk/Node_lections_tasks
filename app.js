const express = require('express');
const expressHbs = require('express-handlebars');
const fs = require('fs/promises');
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
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const {login, password} = req.body;
    const dataDB = await fs.readFile(dBPath, 'utf-8');
    const users = JSON.parse(dataDB)
    const findUser = users.find(({login: existLogin, password: existPassword}) => {
        return existLogin === login && existPassword === password;
    });

    if (findUser) {
        const index = users.indexOf(findUser);
        res.redirect(`/users/${index}`);
    }

    if (!findUser) {
        const error = 1;
        res.redirect(`/error/${error}`);
    }
});

app.get('/users/:id', async (req, res) => {
    const {id} = req.params;
    const dataDB = await fs.readFile(dBPath, 'utf-8');
    const users = JSON.parse(dataDB);
    const {login} = users[id];

    res.render('user', {login});
});

app.get('/users', async (req, res) => {
    const dataDB = await fs.readFile(dBPath, 'utf-8');
    const users = JSON.parse(dataDB);

    res.render('users', {users});
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const body = req.body;
    const {login, password} = body;
    const dataDB = await fs.readFile(dBPath, 'utf-8');
    const users = JSON.parse(dataDB)
    const findUser = users.find(({login: existLogin, password: existPassword}) => {
        return existLogin === login && existPassword === password;
    });

    if (findUser) {
        const error = 2;
        res.redirect(`/error/${error}`);
    }
    if (!findUser) {
        if (!login) {
            const error = 3;
            res.redirect(`/error/${error}`);
            return;
        }
        if (!password) {
            const error = 4;
            res.redirect(`/error/${error}`);
            return;
        }
        users.push(body);
        const writeData = await fs.writeFile(dBPath, JSON.stringify(users), 'utf-8');
        const index = users.length - 1;
        res.redirect(`/users/${index}`);
    }
});

app.get('/error/:id', (req, res) => {
    const {id} = req.params;
    let errorMessage = '';

    switch (id) {
        case '1':
            errorMessage = 'Not found user, you can try register or use another login!';
            break;
        case '2':
            errorMessage = 'This login exist, please chose another login!';
            break;
        case '3':
            errorMessage = 'Login can not be EMPTY!';
            break;
        case '4':
            errorMessage = 'Password can not be EMPTY!';
            break;
        default:
    }

    res.render('error', {errorMessage});
});
