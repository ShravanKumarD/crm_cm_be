const express = require("express");
const router = express.Router();
const creditReportController = require("./../controllers/creditReport.controller");

router.post("/", creditReportController.create);
router.get("/", creditReportController.findAll);
// router.get("/:id", creditReportController.findOne);
// router.put("/:id", creditReportController.update);
router.delete("/:id", creditReportController.delete);
router.get('/:id', creditReportController.findByLeadId);//fetch user id

module.exports = router;
