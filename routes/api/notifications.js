let express = require('express');
let errors = require('../errors');
let notificationsQ = require('../../queries/notifications');
let verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
let router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    notificationsQ.findAll(function(error,result){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(result);
        }
    })
})

module.exports = router;