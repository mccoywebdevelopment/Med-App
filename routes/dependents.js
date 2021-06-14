let express = require('express');

let dependentQ = require('../queries/dependents');
let verifyAdmin = require('../config/globalHelpers').verifyAdmin;
let verifyUser = require('../config/globalHelpers').verifyUser;
let router = express.Router();

router.route("/:JWT")
    .get(verifyAdmin, function (req, res) {
        dependentQ.findDependents(function (error, allDependents) {
            if (error) {
                console.log(err);
                res.status(400).json({ error: error });
            } else {
                res.send(allDependents);
            }
        })
    })
    .post(verifyAdmin, function (req, res) {
        dependentQ.createDependent(req.body, function (error, result) {
            if (error) {
                console.log(error);
                res.status(400).json({ error: error });
            } else {
                res.send(result);
            }
        });
    });
// /api/dependents/:id
router.route("/:id/:JWT")
    .get(verifyAdmin, function (req, res) {
        dependentQ.findDependentById(req.params.id, function (error, dependentFound) {
            if (error) {
                console.log(error);
                res.status(400).json({ error: error });
            } else {
                res.send(dependentFound);
            }
        });
    })
    .patch(verifyAdmin, function (req, res) {
        var obj = req.body;

        dependentQ.patchUpdateDependentById(obj, req.params.id, function (err, updatedObj) {
            if (err) {
                console.log(err);
                res.status(400).json({ error: err });
            } else {
                updatedObj._id = req.params.id;
                res.send(updatedObj);
            }
        });
    })
    .delete(verifyAdmin, function (req, res) {
        dependentQ.deleteDependentById(req.params.id, function (err, deletedDoc) {
            if (err) {
                console.log(err);
                res.status(400).json({ error: err });
            } else {
                res.send({ deletedDoc: deletedDoc });
            }
        })
    });

router.route('/dependents-medication/medication/:JWT')
    .get(verifyAdmin, function (req, res) {
        dependentQ.getDependentsWithMeds(function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).json({ error: err });
            } else {
                res.send(result);
            }
        });
    });

module.exports = router;