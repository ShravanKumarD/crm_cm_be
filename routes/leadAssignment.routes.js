const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadAssignment.controller');


router.post('/assign', leadController.assignLeads);
router.get('/asignedbyadmin/:id', leadController.leadAssignmentList);
router.delete('/revertlead/:leadid',leadController.deleteAssignedLead);
router.get('/user-leads/:id', leadController.getAssignedLeadsOfEmployee);
router.put('/bulk-update-status', leadController.updateMultipleLeads);
router.put('/update-lead', leadController.updateMultipleLeads);
router.put('/:id',leadController.update);

module.exports = router;
