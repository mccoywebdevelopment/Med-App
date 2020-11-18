const express = require('express');
const errors = require('../errors');
const router = express.Router();
const dataQ = require('../../queries/exportData');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const path = require('path');

router.route("/:month/:year/:JWT")
.get(verifyAdmin,function(req,res){
    console.log("sldk")
    dataQ.exportDataGivenMonthYear(req.params.month,req.params.year,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            console.log(true)
            res.download(path.join(__dirname,'../..','/config/excel/data.xlsx'));
        }
    });
});


module.exports = router;