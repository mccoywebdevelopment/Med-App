const express = require('express');
const errors = require('../errors');
const notificationsQ = require('../../queries/notifications');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const router = express.Router();

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