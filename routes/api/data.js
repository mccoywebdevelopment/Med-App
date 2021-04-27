let express = require('express');
let errors = require('../errors');
let router = express.Router();
let dataQ = require('../../queries/data');
let verifyAdmin = require('../../config/globalHelpers').verifyAdmin;


router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    dataQ.getAll(req.params.JWT,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
});
module.exports = router;