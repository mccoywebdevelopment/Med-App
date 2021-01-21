const express = require('express');
const router = express.Router();
const path = require('path');
const errors = require('../errors');
const mailQ = require('../../queries/mailer');
const CLIENT_URL = process.env.CLIENT_URL || require('../../config/configVars').CLIENT_URL;
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;

router.route("/send-welcome/:email/:JWT")
  .get(verifyAdmin, function (req, res) {
    let email = {
      subject: "Welcome",
      title: "Welcome!",
      msg: "Welcome to Sunshine Acres rxs database! Please register by clicking the button below.",
      btnTxt: "Activate",
      imagePath: path.join(__dirname, '../..', '/config/email/activation_email/images/image.png'),
      to: req.params.email,
      isEmailToken: true,
      templatePath: path.join(__dirname, '../..', '/config/email/activation_email/index.html'),
      redirectURL: 'api/auth/email/redirect'
    }

    mailQ.sendMail(email.subject, email.title, email.msg, email.btnTxt, email.imagePath, email.to, email.isEmailToken,
      email.templatePath, email.redirectURL, function (err, result) {
        if (err) {
          console.log(err);
          res.status(errors.code.BAD_REQUEST).json({ error: err });
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
        res.status(errors.code.BAD_REQUEST).json({ error: err });
      } else if (!token) {
        res.status(errors.code.BAD_REQUEST).json({ error: "Invalid Token" });
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
      imagePath: path.join(__dirname, '../..', '/config/email/activation_email/images/forgot_password.png'),
      to: req.body.email,
      isEmailToken: true,
      templatePath: path.join(__dirname, '../..', '/config/email/activation_email/index.html'),
      redirectURL: 'auth/reset-password'
    }

    mailQ.sendMail(email.subject, email.title, email.msg, email.btnTxt, email.imagePath, email.to, email.isEmailToken,
      email.templatePath, email.redirectURL, function (err, result) {
        if (err) {
          console.log(err);
          res.status(errors.code.BAD_REQUEST).json({ error: err });
        } else {
          res.json({ result: result });
        }
      });
    // mailQ.sendMail("Forgot Password", "Forgot password? Please click the link below to set a new password.", "Reset Password", req.body.email, true,
    //   path.join(__dirname, '../..', '/config/email/emailTemplate/welcomeEmail.html'), "auth/reset-password", function (err, result) {
    //     if (err) {
    //       console.log(err);
    //       res.status(errors.code.BAD_REQUEST).json({ error: err });
    //     } else {
    //       res.json({ result: result });
    //     }
    //   });
  });

module.exports = router;