const db = require("./../models/index"); 
const CreditReport = db.creditReport;

// Create a new CreditReport
exports.create = async (req, res) => {
    try {
        const creditReport = await CreditReport.create({
            creditCardName: req.body.creditCardName,
            totalOutstanding: req.body.totalOutstanding,
            userId:req.body.userId ,
            leadId: req.body.leadId
        });
        res.status(201).json({ message: "Credit report created successfully", creditReport });
    } catch (error) {
        res.status(500).json({ message: "Error creating credit report", error: error.message });
    }
};

// Retrieve all CreditReports
exports.findAll = async (req, res) => {
    try {
        const creditReports = await CreditReport.findAll();
        res.status(200).json(creditReports);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving credit reports", error: error.message });
    }
};

// Retrieve a single CreditReport by id
// exports.findOne = async (req, res) => {
//     try {
//         const creditReport = await CreditReport.findByPk(req.params.id);
//         if (!creditReport) {
//             return res.status(404).json({ message: "Credit report not found" });
//         }
//         res.status(200).json(creditReport);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving credit report", error: error.message });
//     }
// };

// Update a CreditReport by id
// exports.update = async (req, res) => {
//     try {
//         const creditReport = await CreditReport.findByPk(req.params.id);
//         if (!creditReport) {
//             return res.status(404).json({ message: "Credit report not found" });
//         }
//         await creditReport.update(req.body);
//         res.status(200).json({ message: "Credit report updated successfully", creditReport });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating credit report", error: error.message });
//     }
// };

// Delete a CreditReport by id
exports.delete = async (req, res) => {
    try {
        const creditReport = await CreditReport.findByPk(req.params.id);
        if (!creditReport) {
            return res.status(404).json({ message: "Credit report not found" });
        }
        await creditReport.destroy();
        res.status(200).json({ message: "Credit report deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting credit report", error: error.message });
    }
};

exports.findByLeadId = async (req, res) => {
    try {
        const leadId = req.params.id;
        const creditReport = await CreditReport.findAll({
            where: { leadId: leadId }
        });
        if (creditReport.length === 0) {
            return res.status(404).json({ message: "No credit reports found for the user" });
        }
        res.status(200).json(creditReport);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving credit reports by userId", error: error.message });
    }
};