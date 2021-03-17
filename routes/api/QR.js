const express = require('express');
const errors = require('../errors');
const router = express.Router();
const path = require('path');
const quickRespQ = require('../../queries/quickResponseCode');
const CLIENT_URL = process.env.CLIENT_URL || require('../../config/configVars').CLIENT_URL;
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;

router.route("/generate-svg-code/all/:token")
.get(function(req,res){
    let url = CLIENT_URL + "/user/log-event/" + req.params.medID + "/";
    let basePath = path.join(__dirname, '../..', '/config/pdf/Dependent-Medications');

    quickRespQ.generateFile(basePath,"all",null,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.download(basePath+"/result/index.pdf");
        }
    });
});

module.exports = router;