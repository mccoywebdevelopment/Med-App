const express = require('express');
const errors = require('../errors');
const router = express.Router();
const dataQ = require('../../queries/exportData');
const quickRespQ = require('../../queries/quickResponseCode');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const path = require('path');

router.route("/:month/:year/:JWT")
.get(verifyAdmin,function(req,res){
    dataQ.exportDataGivenMonthYear(req.params.month,req.params.year,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.download(path.join(__dirname,'../..','/config/excel/data.xlsx'));
        }
    });
});

router.route("/qr/generate-svg-code/all/:JWT")
.get(verifyAdmin,function(req,res){
    console.log(true)
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