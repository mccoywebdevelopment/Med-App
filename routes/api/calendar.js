const express = require('express');
const errors = require('../errors');
const router = express.Router();
const calendarQ = require('../../queries/calendar');
const verifyUser = require('../../config/globalHelpers').verifyUser;


router.route("/:JWT/get-dates-medication-taken")
.get(verifyUser,function(req,res){
    calendarQ.getDatesOfMeds(req.params.JWT,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    })
});




module.exports = router;