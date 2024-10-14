const express = require("express");
const homeReportController = require("../controllers/loansReport.controller");

const router = express.Router();

router.post('/', homeReportController.createHomeLoanReport);
router.get('/', homeReportController.getAllHomeReports);

module.exports = router;
