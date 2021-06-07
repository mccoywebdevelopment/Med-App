let express = require('express');
let router = express.Router();
let path = require('path');

let mailQ = require('../queries/mailer');
let CLIENT_URL = process.env.CLIENT_URL || require('../config/configVars').CLIENT_URL;
let BASE_URL = process.env.BASE_URL || require('../config/configVars').BASE_URL;
let verifyAdmin = require('../config/globalHelpers').verifyAdmin;

router.route("/send-welcome/:email/:JWT")
  .get(verifyAdmin, function (req, res) {
    let email = {
      subject: "Welcome",
      title: "Welcome!",
      msg: "Welcome to Sunshine Acres rxs database! Please register by clicking the button below.",
      btnTxt: "Activate",
      imagePath: path.join(__dirname, '..', '/config/email/activation_email/images/image.png'),
      to: req.params.email,
      isEmailToken:true,
      templatePath: path.join(__dirname, '..', '/config/email/activation_email/index.html'),
      redirectURL: BASE_URL + '/api/auth/email/redirect/' + req.params.email
    }

    mailQ.sendMail(email.subject, email.title, email.msg, email.btnTxt, email.imagePath, email.to, email.isEmailToken,
      email.templatePath, email.redirectURL, function (err, result) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: err });
        } else {
          res.json({ result: result });
        }
      });
  });

router.route("/redirect/:email/:token")
  .get(function (req, res) {
    mailQ.authenticateUserEmail(req.params.email, req.params.token, function (err, token) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: err });
      } else if (!token) {
        res.status(400).json({ error: "Invalid Token" });
      } else {
        res.writeHead(301,
          { Location: CLIENT_URL + '/auth/register/' + req.params.email + '/' + token }
        );
        res.end();
      }
    });
  });


router.route("/forgot-password")
  .post(function (req, res) {
    let email = {
      subject: "Forgot Password",
      title: "Reset Your Password:",
      msg: "Forgot password? Please click the button below to set a new password.",
      btnTxt: "Reset",
      isEmailToken:true,
      imagePath: path.join(__dirname, '..', '/config/email/activation_email/images/forgot_password.png'),
      to: req.body.email,
      templatePath: path.join(__dirname, '..', '/config/email/activation_email/index.html'),
      redirectURL: CLIENT_URL + '/auth/reset-password/'+req.body.email
    }

    mailQ.sendMail(email.subject, email.title, email.msg, email.btnTxt, email.imagePath, email.to, email.isEmailToken,
      email.templatePath, email.redirectURL, function (err, result) {
        if (err) {
          console.log(err);
          res.status(400).json({ error: err });
        } else {
          res.json({ result: result });
        }
      });
  });

module.exports = router;