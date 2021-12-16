if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()
const mongoose = require('mongoose')
const userSchema = require('./schemas/PlayerSchema')
const gifSchema = require('./schemas/gifSchema')
const UserController = require("./controllers/UserController.js")
var mongodb = require('mongodb');

//connects to mongodb database wether production or localhost
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '))
db.once('open', function () {
    console.log('database connected')
})

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
var requestify = require('requestify');


const initPassport = require('./passport-config')
initPassport(
    passport,
    email => userSchema.find(email).email,
    id => userSchema.find(id).id
)

app.set('view-engine', "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'));

// One big isssue with this application is that none a lot of routes are in the Server file which is a big no no.
// they should be in there own controllers since its a lot simpler for any programmer to pick this up

// if the user is authenticated then allow the user to go to the home page
app.get('/', checkAuthenticated, async (req, res) => {
    var url = process.env.GIPHY_URL + process.env.GIPHY_API_KEY
    const random_gif = await requestify.get(url).then(function(res) {
        return res.getBody().data.images.original.url
    })
    var saved_gifs = await gifSchema.find({id: req.user.id}).limit(50)
    
    res.render('index.ejs', { user: req.user, gif: random_gif , gifs: saved_gifs})
})

// this is to save one of the gifs, we can only save if the user is authenticated
app.post('/', checkAuthenticated, async (req, res) => {
    console.log(req.user.id)
    const new_rec = await gifSchema.create({
        gif: req.body.gif,
        id: req.user.id
    })
    console.log(new_rec)
    const hello = await userSchema.findOneAndUpdate({ "id": req.user.id }, { $push: { "PlayerData": new_rec } })
    console.log(hello)
    res.redirect('/')
})

// this is to delete a gif, if the gif exists then it will be deleted.
app.post('/delete/:id', checkAuthenticated, async (req, res) => {
    console.log("Delete gif ID " + req.params.id)
    
    await gifSchema.deleteOne({ _id: new mongodb.ObjectID( req.params.id )});
    res.redirect('/')
})

// this is where the login functionality will haping depending on the checkNotAuthenticated function.
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/login', checkNotAuthenticated, UserController.getLogin)
app.get('/register', checkNotAuthenticated, UserController.getRegister)
app.get('/logout', UserController.getLogout)
app.post('/register', checkNotAuthenticated, UserController.postRegister)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next()
}


app.listen(process.env.PORT || 3000)