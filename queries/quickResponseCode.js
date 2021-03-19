const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const groupModel = require('../models/group/Group');
const rxsMedicationModel = require('../models/rxsMedication/RxsMedication');
const rxsModel = require('../models/rxs/Rxs');
const ejs = require('ejs');
const fs = require('fs')
const {CLIENT_URL} = process.env.CLIENT_URL || require('../config/configVars');


var createCode = function(url, type) {
    return new Promise(function(resolve, reject){
        QRCode.toString(url, { type }, function (err, url) {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        })
    });
}
function base64_encode(qrCode) {
    return new Buffer(qrCode).toString('base64');
}
function render(basePath, data, callback) {
    let templateLocation = basePath + "/template/index.html";
    let handlebarsLocation = basePath + "/handlebars-result/index.html";
    let resultLocation = basePath + "/result/index.pdf";

    fs.readFile(templateLocation, { encoding: 'utf-8' }, function (err, file) {
        if (err) {
            callback(err);
        } else if (!file) {
            callback("Can't find template file.");
        } else {
            // let settings = getSettings(groups);
            var output = ejs.render ( file.toString() , {pages:data} );
        
            fs.writeFile(handlebarsLocation, output, function (err) {
                if (err) {
                    callback(err);
                } else if (!data) {
                    callback("Can't save template file.");
                } else {
                    (async () => {
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();
                        await page.goto("file://" + handlebarsLocation);
                        await page.pdf({ path: resultLocation, printBackground: true });
                        await browser.close();
                        callback(null,page)
                    })();
                }
              });
        }
    });
}

function formatData(groups){
    let pages = [];
    for(var i=0;i<groups.length;++i){
        for(var ix=0;ix<groups[i].dependents.length;++ix){
            let rxsMedications = getDependentsMeds(groups[i].dependents[ix]);
            for(var x=0;x<rxsMedications.length;++x){
                if(x%5==0 || x==0){
                    pages.push({
                        dependentName:groups[i].dependents[ix].name.firstName + " " + groups[i].dependents[ix].name.lastName,
                        dependentURL:CLIENT_URL + "/admin/dependents/"+groups[i].dependents[ix]._id,
                        dependentDateOfBirth:groups[i].dependents[ix].dateOfBirth,
                        dependentCreated:groups[i].dependents[ix].dateCreated,
                        group:groups[i].name,
                        rxsMedications:[rxsMedications[x]]
                    });
                }else{
                    pages[pages.length-1].rxsMedications.push(rxsMedications[x]);
                }
            }
        }
    }
    return pages;
}
function getDependentsMeds(dep){
    let meds = [];
    for(var i=0;i<dep.rxs.length;++i){
        for(var ix=0;ix<dep.rxs[i].rxsMedications.length;++ix){
            meds.push(dep.rxs[i].rxsMedications[ix]);
        }
    }
    return meds;
}
function getData(depID,medID,callback){
    if(depID == "all"){
        groupModel.find({}).populate('dependents').exec(function (err, groupsFound) {
            if(err){
                callback(err);
              }else if(!groupsFound){
                callback("No groups listed");
              }else{
                rxsModel.populate(groupsFound,{path:"dependents.rxs"},function(err,res){
                  if(err){
                     callback(err);
                  }else{
                      rxsMedicationModel.populate(res,{path:"dependents.rxs.rxsMedications"},function(err,res){
                          if(err){
                              callback(err);
                          }else{
                              res = formatData(res);
                              callback(null,res);
                          }
                        });
                    }
                });
            }
          });
    }else{
        callback("All option is the only one that is supported");
    }
}
function generateFile(basePath, depID, medID, callack) {
    getData(depID,medID,function(err,data){
        if(err){
            callack(err);
        }else if(!data){
            callack("Data not found.")
        }else{
            render(basePath, data, function (err, result) {
                if (err) {
                    callack(err);
                } else {
                    callack(null, result);
                }
            });
        }
    });
}

module.exports = { createCode, generateFile }