const express = require('express');
const errors = require('../errors');
const groupQ = require('../../queries/group');
const verifyUser = require('../../config/globalHelpers').verifyUser;
const verifyAdmin = require('../../config/globalHelpers').verifyAdmin;

const router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    groupQ.findAll(function(error,allgroups){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(allgroups);
        }
    })
})
.post(verifyAdmin,function(req,res){
    groupQ.create(req.body,function(error,result){
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
    groupQ.findById(req.params.id,function(error,medFound){
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
    groupQ.patchUpdateById(obj,req.params.id,function(err,updatedObj){
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
    groupQ.deleteById(req.params.id,function(err,deletedDoc){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send({deletedDoc:deletedDoc});
        }
    })
});


module.exports = router;