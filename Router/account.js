var express = require('express');
var Router = express.Router();
var connection = require('../model/db');
const crypto = require("crypto");

function hashing(password) {
  let salt = crypto.randomBytes(32).toString('hex')
  return [salt, crypto.pbkdf2Sync(password, salt, 99097, 32, 'sha512').toString('hex')]
}

Router.get('/', (req, res) => {
  if(typeof req.session.error_msg != "undefined"){
    console.log(req.session.error_msg)
  } else {
    req.session.error_msg = ""
  }
  res.render("account", {error_msg: req.session.error_msg})
})

Router.post('/signin-authentication', function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let newName = email.replace(/[^a-z 0-9 ! ? @ .]/gi,'');
  let newPassword = password.replace(/[^a-z 0-9 ! ? @ .]/gi,'');

  console.log(email, newName,password, newPassword)

  //filter invalid words
  if(password != newPassword || email != newName){
    req.session.error_msg = 'INVALID WORD DETECTED';
    res.redirect('/account');
    return 0;
  }
  connection.query('SELECT * FROM users WHERE email = ?', email, function (err, rows, fields) {
    //check if user exist
    if (typeof rows[0] == 'undefined') {
      req.session.error_msg = 'NO SUCH USER';
      res.redirect('/account');
      return 0;
    }

    if (crypto.pbkdf2Sync(password, rows[0].salt, 99097, 32, 'sha512').toString('hex') == rows[0].password) {
      res.cookie("names", email, {
        maxAge: 1000 * 60 * 10,
        secure: true,
        httpOnly: true,
        signed: true,
        authorized: true,
        httpOnly: true,
      });
      req.session.email = email;
      req.session.loggedin = true;
      console.log("login success")
      res.redirect('/');
      return 0;
    }
    else {
      req.session.error_msg = 'NO SUCH USER';
      res.redirect('/account');
      return 0;
    }
  })
})



Router.post('/signup-authentication', function (req, res, next) {
  let email = req.body.email;
  let name = req.body.name;
  let password = req.body.password;

  let newEmail = email.replace(/[^a-z 0-9 ! ? @ .]/gi,'');
  let newName = name.replace(/[^a-z 0-9 ! ? @ .]/gi,'');
  let newPassword = password.replace(/[^a-z 0-9 ! ? @ .]/gi,'');

  if(email != newEmail || name != newName || password != newPassword){
    req.session.r_error_msg = 'INVALID WORD DETECTED';
    res.redirect('/account');
    return 0;
  }

  let hashed = hashing(password);
  console.log(hashed, hashed[0], hashed[1]);
  connection.query("SELECT * from users", function(err, rows) {
    console.log(rows[0])
  })
  //check email
  connection.query("SELECT * FROM users WHERE email = ?", email, function (err, rows, field) {
    if (typeof rows[0] == 'undefined') {
      //check name
      connection.query("SELECT * FROM users WHERE name = ?", name, function (err, rows, field) {
        if (typeof rows[0] == 'undefined') {
          console.log("new");
          var user = {
            name: name,
            email: email,
            password: hashed[1],
            salt: hashed[0],
          }
          console.log(hashing(password));
          console.log(user);
          connection.query('INSERT INTO users SET ?', user);
          res.redirect('/account');
          return 0;
        } else {
          req.session.r_error_msg = 'ALREADY EXIST';
          console.log('not new');
          res.redirect('/account');
        }
      })
      return 0;
    } else {
      console.log("not new");
      req.session.r_error_msg = 'ALREADY EXIST';
      res.redirect('/account');
    }
  });
  console.log(email);
})

Router.get('/signup', function (req, res) {
  req.session.error_msg = "";

  if (req.session.loggedin) {
    res.render('register', {
      title: 'Registration Page',
      name: '',
      email: '',
      password: '',
      button: "SIGN IN",
      path: "/account",
      error: req.session.r_error_msg,
    })
  } else {
    res.render('register', {
      title: 'Registration Page',
      name: '',
      email: '',
      password: '',
      button: "SIGN IN",
      path: "/account",
      error: req.session.r_error_msg,
    })
  }
})

Router.get('/logout', function (req, res) {
  req.session.destroy();
  res.cookie('names', '', { maxAge: 0 });
  res.redirect('/');
});

module.exports = Router;