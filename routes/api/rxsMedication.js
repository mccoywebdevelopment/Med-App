const express = require('express');
const errors = require('../errors');
const rxsMedicationQ = require('../../queries/rxsMedication');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    rxsMedicationQ.findAll(function(error,allmedications){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(allmedications);
        }
    })
})
.post(verifyAdmin,function(req,res){
    rxsMedicationQ.create(req.body,function(error,result){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(result);
        }
    });
});
router.route("/:id/:JWT")
.get(verifyAdmin,function(req,res){
    rxsMedicationQ.findById(req.params.id,function(error,medFound){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(medFound);
        }
    });
})
.patch(verifyAdmin,function(req,res){
    var obj = req.body;
    rxsMedicationQ.patchUpdateById(obj,req.params.id,function(err,updatedObj){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send(updatedObj);
        }
    });
})
.delete(verifyAdmin,function(req,res){
    rxsMedicationQ.deleteById(req.params.id,function(err,deletedDoc){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send({deletedDoc:deletedDoc});
        }
    })
});


module.exports = router;