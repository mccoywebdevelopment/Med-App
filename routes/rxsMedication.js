let express = require('express');

let rxsMedicationQ = require('../queries/rxsMedication');
let verifyAdmin = require('../config/globalHelpers').verifyAdmin;
let verifyUser = require('../config/globalHelpers').verifyUser
let router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    rxsMedicationQ.findAll(function(error,allmedications){
        if(error){
            console.log(error);
            res.status(400).json({error:error});
        }else{
            res.send(allmedications);
        }
    })
})
.post(verifyAdmin,function(req,res){
    rxsMedicationQ.create(req.body,function(error,result){
        if(error){
            console.log(error);
            res.status(400).json({error:error});
        }else{
            res.send(result);
        }
    });
});
router.route("/:id/:JWT")
.get(verifyUser,function(req,res){
    rxsMedicationQ.findById(req.params.id,function(error,medFound){
        if(error){
            console.log(error);
            res.status(400).json({error:error});
        }else{
            res.send(medFound);
        }
    });
})
.patch(verifyAdmin,function(req,res){
    var obj = req.body;
    console.log(obj);
    rxsMedicationQ.patchUpdateById(obj,req.params.id,function(err,updatedObj){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            updatedObj._id = req.params.id;
            res.send(updatedObj);
        }
    });
})
.delete(verifyAdmin,function(req,res){
    rxsMedicationQ.deleteById(req.params.id,function(err,deletedDoc){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.send({deletedDoc:deletedDoc});
        }
    })
});

router.route("/get/medication/refID/:id")
.get(function(req,res){
    rxsMedicationQ.findByRefID(req.params.id,function(err,medFound){
        if(err){
            console.log(err);
            res.status(400).json({error:err});
        }else{
            res.send(medFound);
        }
    });
})

module.exports = router;