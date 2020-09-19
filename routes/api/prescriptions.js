const express = require('express');
const errors = require('../errors');
const prescriptionQ = require('../../queries/prescription');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    prescriptionQ.findAll(function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
})
.post(verifyAdmin,function(req,res){
    prescriptionQ.create(req.body,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
});

router.route("/:id/:JWT")
.get(verifyAdmin,function(req,res){
    prescriptionQ.findById(req.params.id,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
})
.patch(verifyAdmin,function(req,res){
    prescriptionQ.patchUpdateById(req.body,req.params.id,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send({updatedDoc:result});
        }
    });
})
.delete(verifyAdmin,function(req,res){
    prescriptionQ.deleteById(req.params.id,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send({deletedDoc:result});
        }
    });
});
router.route('/:id/rxs-medication/:medId/:JWT')
.delete(verifyAdmin,function(req,res){
    prescriptionQ.removeRxsMedicationFromRxs(req.params.id,req.params.medId,function(err,result){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(result);
        }
    });
});



module.exports = router;