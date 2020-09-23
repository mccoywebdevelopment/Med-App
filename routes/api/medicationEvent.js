const express = require('express');
const errors = require('../errors');
const router = express.Router();
const eventQ = require('../../queries/medicationEvent');
const verifyUser = require('../../config/globalHelpers').verifyUser;

router.route("/:JWT/:rxsMedicationId")
.post(verifyUser,function(req,res){
    eventQ.tookToday(req.params.rxsMedicationId,req.params.JWT,req.body,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    })
});

router.route("/:JWT/med-event/:eventId")
.patch(verifyUser,function(req,res){
    eventQ.patchUpdateById(req.body,req.params.eventId,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            result._id = req.params.id;
            res.send(result);
        }
    });
})
.delete(verifyUser,function(req,res){
    eventQ.deleteById(req.params.eventId,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    })
});

module.exports = router;