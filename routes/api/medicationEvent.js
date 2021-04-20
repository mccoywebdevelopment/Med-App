const express = require('express');
const errors = require('../errors');
const router = express.Router();
const eventQ = require('../../queries/medicationEvent');
const verifyUser = require('../../config/globalHelpers').verifyUser;
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const verifyRefID = require('../../config/globalHelpers').verifyRefID;

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
    eventQ.tookMedication(req.params.rxsMedicationId,req.params.JWT,req.body,req.user,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    })
});
router.route("/took-event/refID/:refID")
.post(verifyRefID,function(req,res){
    eventQ.tookMedicationRefID(req.rxsMedicationRefID,req.body,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
})


router.route("/:id/:JWT")
.patch(verifyAdmin,function(req,res){
    eventQ.patchUpdateById(req.body,req.params.id,function(err,result){
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