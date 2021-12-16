const userSchema = require('../schemas/PlayerSchema')
const bcrypt = require('bcrypt')

// this is only to render the login page, NOT TO LOGIN
const getLogin = async(req, res, next) => {
    res.render('login.ejs')
}

// a request for logout, on request redirect
const getLogout = async(req, res, next) => {
    req.logOut()
    res.redirect('/login')
}

// this is only to get the Register page nothing else.
const getRegister = async(req, res, next) => {
    res.render('register.ejs')
}

//This is actually doing the register.
const postRegister = async(req, res, next) => {
    try {
        // BCrypt is the safest password genereator.
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        await userSchema.create({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            role: 'user'
        })
        res.redirect('/login')
    } catch (e) {
        console.log(e)
        res.redirect('/register')
    }
}

module.exports = {getLogin, getLogout, getRegister, postRegister}