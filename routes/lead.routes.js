const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');

router.post('/', leadController.createLead);
router.post('/bulk',leadController.createBulkLeads);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', leadController.updateLead);
router.put('/:id/:action', leadController.updateLeadinBulk);
router.delete('/:id', leadController.deleteLead);

//bulk delete
router.delete('/bulk-delete', leadController.deleteBulkLeads);
//i/p should like this {
//   "ids": [1, 2, 3, 4, 5]
// }


module.exports = router;
