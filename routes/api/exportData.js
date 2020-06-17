const express = require('express');
const errors = require('../errors');
const router = express.Router();
const dataQ = require('../../queries/exportData');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const path = require('path');

router.route("/:JWT/:month/:year")
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


module.exports = router;