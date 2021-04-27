let express = require('express');
let errors = require('../errors');
let guardianQ = require('../../queries/guardian');
let verifyUser = require('../../config/globalHelpers').verifyUser;
let verifyAdmin = require('../../config/globalHelpers').verifyAdmin;

let router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    guardianQ.findAll(function(error,allguardians){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(allguardians);
        }
    })
})
.post(verifyAdmin,function(req,res){
    guardianQ.create(req.body,function(error,result){
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
    guardianQ.findById(req.params.id,function(error,medFound){
        if(error){
            console.log(error);
            res.status(errors.code.BAD_REQUEST).json({error:error});
        }else{
            res.send(medFound);
        }
    });
})
.patch(verifyUser,function(req,res){
    var obj = req.body;
    guardianQ.patchUpdateById(obj,req.params.id,function(err,updatedObj){
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
    guardianQ.deleteById(req.params.id,function(err,deletedDoc){
        if(err){
            console.log(err);
            res.status(errors.code.BAD_REQUEST).json({error:err});
        }else{
            res.send({deletedDoc:deletedDoc});
        }
    })
});


module.exports = router;