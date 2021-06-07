let express = require('express');

let router = express.Router();
let dataQ = require('../queries/exportData');
let quickRespQ = require('../queries/quickResponseCode');
let verifyAdmin = require('../config/globalHelpers').verifyAdmin;
let path = require('path');

router.route("/:month/:year/:JWT")
.get(verifyAdmin,function(req,res){
    dataQ.exportDataGivenMonthYear(req.params.month,req.params.year,function(err,result){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.download(path.join(__dirname,'..','/config/excel/data.xlsx'));
        }
    });
});

router.route("/qr/generate-svg-code/all/:JWT")
.get(verifyAdmin,function(req,res){
    let basePath = path.join(__dirname, '..', '/config/pdf/Dependent-Medications');
    quickRespQ.generateFile(basePath,"all",null,function(err,result){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.download(basePath+"/result/index.pdf");
        }
    });
});


module.exports = router;