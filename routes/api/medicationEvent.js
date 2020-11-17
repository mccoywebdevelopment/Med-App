const express = require('express');
const errors = require('../errors');
const router = express.Router();
const eventQ = require('../../queries/medicationEvent');
const verifyUser = require('../../config/globalHelpers').verifyUser;

router.route("/:rxsMedicationId/:JWT")
.get(verifyUser,function(req,res){
    eventQ.getEventByRxsMedID(req.params.rxsMedicationId,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
})
.post(verifyUser,function(req,res){
    /*
    fields:
        isAway,notes,dateTaken
    */
    eventQ.tookMedication(req.params.rxsMedicationId,req.params.JWT,req.body,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    })
});

router.route("/:id/:JWT")
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
    eventQ.deleteById(req.params.id,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    })
});

module.exports = router;