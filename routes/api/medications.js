const express = require('express');
const errors = require('../errors');
const medicationQ = require('../../queries/medication');
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;
const verifyUser = require('../../config/globalHelpers').verifyUser;

const router = express.Router();

router.route("/:JWT")
.get(verifyUser,function(req,res){
    medicationQ.findAll(function(error,allmedications){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(allmedications);
        }
    })
})
.post(verifyAdmin,function(req,res){
    medicationQ.create(req.body,function(error,result){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(result);
        }
    });
});
router.route("/:id/:JWT")
.get(verifyUser,function(req,res){
    medicationQ.findById(req.params.id,function(error,medFound){
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
    medicationQ.patchUpdateById(obj,req.params.id,function(err,updatedObj){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            updatedObj._id = req.params.id;
            res.send(updatedObj);
        }
    });
})
.delete(verifyAdmin,function(req,res){
    medicationQ.deleteById(req.params.id,function(err,deletedDoc){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send({deletedDoc:deletedDoc});
        }
    })
});


module.exports = router;