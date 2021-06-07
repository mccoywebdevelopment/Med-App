let express = require('express');

let notificationsQ = require('../queries/notifications');
let verifyAdmin = require('../config/globalHelpers').verifyAdmin;
let router = express.Router();

router.route("/:JWT")
.get(verifyAdmin,function(req,res){
    notificationsQ.findAll(function(error,result){
        if(error){
            console.log(error);
            res.status(400).json({error:error});
        }else{
            res.send(result);
        }
    })
})

module.exports = router;