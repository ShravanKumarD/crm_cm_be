const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadAssignment.controller');

// Define route for assigning leads
router.post('/assign', leadController.assignLeads);
// router.get('/assigned/:id', leadController.getAssignedLeads);
router.get('/asignedbyadmin/:id', leadController.leadAssignmentList);
router.delete('/revertlead/:leadid',leadController.deleteAssignedLead);
// Other lead-related routes can be added here
// router.get('/', leadController.getLeads);
// router.post('/', leadController.createLead);

module.exports = router;
