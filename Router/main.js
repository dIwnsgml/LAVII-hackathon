const express = require("express");
const Router = express.Router();
const connection = require('../model/db');
const { Configuration, OpenAIApi } = require("openai");
const info = require("../config/info.json");
const axios = require("axios");



Router.get("/", async (req, res) => {
  console.log(req.session.loggedin)
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }
  res.render('index', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.post("/analysis", async (req, res) => {
  if(req.session.loggedin == true){
    connection.query("select * from users where email = ?", req.session.email, (err, rows) => {
      if(typeof rows[0] != "undefined"){
        console.log(rows[0].survey_result)
        if(typeof rows[0].survey_result != "undefined"){
          (async () => {
            const configuration = new Configuration({
              apiKey: info.OpenAiApi,
            });
            const openai = new OpenAIApi(configuration);
            let new_places = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: `Based on user information, give specific country to visit and also reason why it would be good place for user to visit by bringing what user answered in the question. you should return value as json. this is an exampe: {
                "paris": {
                  "location": {"latitude":"48.864716", "longitude": "2.349014"},
                  "reason": "explanation of why paris is good place for this user to visit by bringing specific question that user answered in the past, very specifically. more than 8 sentences",
                  "plan": "plan based on user preference and explain why everything is planed in this way by bringing survey answers. more than 7 sentences",
                  "negativesie": "show negative side of choosing this place by bringing specific reason and by bringing what user answered in the past"
                }
              }. Give like 10 places to go. this is list of information about user: ${rows[0].survey_result}`,
              max_tokens: 2000,
              temperature: 1,
            });
            console.log(new_places.data.choices[0].text)
            res.send(new_places.data.choices[0].text)
          })();
        } else {
          res.redirect("/take_survey")
        }
      } else {
        res.redirect("/account")
      }
    })
  } else {
    res.redirect("/account")
  }
})

Router.get("/about", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('about', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/blog", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('blog', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/contact", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('contact', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/destination", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('destination', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/guide", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('guide', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/service", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('service', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/package", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('package', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/single", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('single', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/testimonial", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
  } else {
    navbar_msg = "Sign In"
    navbar_url = "/account"
  }

  res.render('testimonial', {navbar_msg: navbar_msg, navbar_url: navbar_url})
})

Router.get("/myaccount", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
    connection.query("SELECT * FROM users where email = ?", req.session.email, (err, rows, fields) => {
      console.log(rows[0])
      res.render('myaccount', {navbar_msg: navbar_msg, navbar_url: navbar_url, user_info: rows[0]})
    })
  } else {
    res.redirect("/")
  }
})

Router.get("/take_survey", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
    connection.query("SELECT * FROM users where email = ?", req.session.email, (err, rows, fields) => {
      console.log(rows[0])
      res.render('survey', {navbar_msg: navbar_msg, navbar_url: navbar_url, user_info: rows[0]})
    })
  } else {
    res.redirect("/")
  }
})

Router.post("/survey-submit", async (req, res) => {
  if(req.session.loggedin == true){
    navbar_msg = "My Account"
    navbar_url = "/myaccount"
    let answers = req.body
    console.log(answers, req.session.email)
    connection.query(`UPDATE users set survey_result = ? where email = ?`, [JSON.stringify(answers), req.session.email], (err, rows, fields) => {
    })
    res.redirect('/myaccount')
  } else {
    res.redirect("/")
  }
})

module.exports = Router;