const express = require("express");
const router = express.Router();
const loansReportController = require("./../controllers/loansReport.controller");

router.post("/", loansReportController.create);
router.get("/", loansReportController.findAll);
// router.get("/:id", loansReportController.findOne);
// router.put("/:id", loansReportController.update);
router.delete("/:id", loansReportController.delete);
router.get('/:id', loansReportController.findByLeadId);//user-id

module.exports = router;
