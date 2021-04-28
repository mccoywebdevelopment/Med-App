let BASE_URL = process.env.BASE_URL || require('../config/configVars').BASE_URL;
let CLIENT_URL = process.env.CLIENT_URL || require('../config/configVars').CLIENT_URL;
let EMAIL = process.env.EMAIL || require('../config/configVars').EMAIL;
let EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || require('../config/configVars').EMAIL_PASSWORD;
let fs = require("fs");
let nodemailer = require("nodemailer");
let User = require('../models/user/User');
let crypto = require('crypto');

function authenticateUserEmail(email, token, callback) {
  User.findOne({ username: email }, function (err, userFound) {
    if (err) {
      callback(err);
    } else if (!userFound) {
      callback("User with the username/email: " + email + " does not exist.");
    } else if (token == userFound.auth.token) {
      userFound.auth.isVerified = true;
      userFound.save(function (err, userSaved) {
        if (err) {
          callback(err);
        } else {
          callback(null, token);
        }
      });
    } else {
      generateToken(email, function (err, newToken) {
        if (err) {
          callback(err);
        } else {
          callback(null, null);
        }
      });
    }
  });
}
function readHTMLFile(path, email, emailToken, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      var token = "";
      if (emailToken) {
        token = "/" + emailToken;
      }
      // html = html.replace("USERNAME", email);
      callback(null, html);
    }
  });

};

function replaceAll(html,key,value){
  html = html.split(key).join(value);
  return(html);
}
function generateToken(email, callback) {
  User.findOne({ username: email }, function (err, UserFound) {
    if (err) {
      callback(err);
    } else if (!UserFound) {
      callback("User with the username/email: " + email + " does not exist.");
    } else {
      var token = crypto.randomBytes(64).toString('hex');
      UserFound.auth.token = token;
      UserFound.save(function (err, userSaved) {
        if (err) {
          callback(err);
        } else {
          callback(null, token);
        }
      });
    }
  });
}
function sendMail(subject, messageTitle, messageText, buttonText, imagePath, email,
  emailToken, templatePath, redirectUrl, callback) {
  
  generateToken(email, function (err, token) {
    if (err) {
      callback(err);
    }
    else {
      if (emailToken) {
        emailToken = token;
      }

      readHTMLFile(templatePath, email, emailToken, function (err, html) {
        if (err) {
          callback(err);
        } else {
          var token = "";
          if (emailToken) {
            token = emailToken;
          }
          let image;
          if (imagePath) {
            image = {
              path: imagePath,
              cid: "image"
            }
            html = replaceAll(html,"EMAIL_IMAGE_PATH", "cid:"+image.cid);
          }
          html = replaceAll(html,"USERNAME",email);
          html = replaceAll(html,"EMAIL_MSG", messageText);
          html = replaceAll(html,"BTN_TEXT", buttonText);
          html = replaceAll(html,"EMAIL_TITLE", messageTitle);

          if (emailToken) {
            html = replaceAll(html,"EMAIL_URL", redirectUrl + "/" + token);
          } else{
            html = replaceAll(html,"EMAIL_URL", redirectUrl);
          }

          sendNodeMail(html, email, subject, image, function (err, result) {
            if (err) {
              callback(err);
            } else {
              callback(null, result);
            }
          });
        }
      });
    }
  });
}

function sendNodeMail(html, email, subject, image, callback) {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      callback(err);
    }
    let transporter = nodemailer.createTransport({
      service: "AOL",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
      }
    });

    let message = {
      from: "Sun Notes <" + EMAIL + ">",
      to: email,
      subject: subject,
      html: html
    };

    if (image) {
      message.attachments = [{
        filename: 'image.png',
        path: image.path,
        cid: image.cid
      }];
    }

    transporter.sendMail(message, (err, info) => {
      if (err) {
        callback(err);
      } else {
        callback(null, "Email was sent please check your inbox.");
      }
    });
  });
}

module.exports = { sendMail, authenticateUserEmail };