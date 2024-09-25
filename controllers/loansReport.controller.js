const db = require("./../models/index");
const LoansReport = db.loansReport;

// Create a new LoansReport
exports.create = async (req, res) => {
    console.log(req.body,"req")
    try {
        const loanReport = await LoansReport.create({
            bankName:req.body.bankName,
            loanAmount: req.body.loanAmount,
            emi: req.body.emi,
            outstanding: req.body.outstanding,
            userId:req.body.userId ,
            leadId: req.body.leadId
        });
        console.log(loanReport,"loanReport")
        res.status(201).json({ message: "Loan report created successfully", loanReport });
    } catch (error) {
        res.status(500).json({ message: "Error creating loan report", error: error.message });
    }
};

// Retrieve all LoansReports
exports.findAll = async (req, res) => {
    try {
        const loanReports = await LoansReport.findAll();
        res.status(200).json(loanReports);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving loan reports", error: error.message });
    }
};

// Retrieve a single LoansReport by id
// exports.findOne = async (req, res) => {
//     try {
//         const loanReport = await LoansReport.findByPk(req.params.id);
//         if (!loanReport) {
//             return res.status(404).json({ message: "Loan report not found" });
//         }
//         res.status(200).json(loanReport);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving loan report", error: error.message });
//     }
// };

// Update a LoansReport by id
// exports.update = async (req, res) => {
//     try {
//         const loanReport = await LoansReport.findByPk(req.params.id);
//         if (!loanReport) {
//             return res.status(404).json({ message: "Loan report not found" });
//         }
//         await loanReport.update(req.body);
//         res.status(200).json({ message: "Loan report updated successfully", loanReport });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating loan report", error: error.message });
//     }
// };

// Delete a LoansReport by id
exports.delete = async (req, res) => {
    try {
        const loanReport = await LoansReport.findByPk(req.params.id);
        if (!loanReport) {
            return res.status(404).json({ message: "Loan report not found" });
        }
        await loanReport.destroy();
        res.status(200).json({ message: "Loan report deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting loan report", error: error.message });
    }
};


exports.findByLeadId = async (req, res) => {
    try {
        const leadId = req.params.id;
        const loanReports = await LoansReport.findAll({
            where: { leadId: leadId }
        });
        if (loanReports.length === 0) {
            return res.status(404).json({ message: "No loan reports found for the user" });
        }
        res.status(200).json(loanReports);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving loan reports by userId", error: error.message });
    }
};
