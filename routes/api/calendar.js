let express = require('express');
let errors = require('../errors');
let router = express.Router();
let calendarQ = require('../../queries/calendar');
let verifyUser = require('../../config/globalHelpers').verifyUser;


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