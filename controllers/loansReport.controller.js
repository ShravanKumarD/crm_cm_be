const db = require("./../models/index");
const LoansReport = db.loansReport;
const HomeLoansReport = db.HomeLoansReport;


exports.createPloanReport = async (req, res) => {
    console.log(req.body,"req.bodu")
    try {
        const loanReport = await LoansReport.create({
            loanType:req.body.loanType,
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
        console.log(error,"error    ")
        res.status(500).json({ message: "Error creating loan report", error: error.message });
    }
};

exports.findAll = async (req, res) => {
    const { leadId } = req.params;

    if (!leadId) {
        return res.status(400).json({ message: "leadId is required" });
    }

    try {
        const loanReports = await LoansReport.findAll({
            where: { leadId }
        });
        res.status(200).json(loanReports);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving loan reports", error: error.message });
    }
};


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
        console.log(leadId,req.params,"LEADID")
        const loanReports = await LoansReport.findAll({
            where: { leadId: leadId }
        });
        console.log(loanReports,"loanReports")
        if (loanReports.length === 0) {
            return res.status(404).json({ message: "No loan reports found for the user" });
        }
        res.status(200).json(loanReports);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving loan reports by userId", error: error.message });
    }
};

exports.createHomeLoanReport =  async (req,res)=>{
    try {
        const homeLoanReport = await HomeLoansReport.create({
            bankName:req.body.bankName,
            loanAmount: req.body.loanAmount,
            emi: req.body.emi,
            outstanding: req.body.outstanding,
            userId:req.body.userId ,
            leadId: req.body.leadId
        });
        console.log(HomeLoansReport,"loanReport")
        res.status(201).json({ message: "Home Loan report created successfully", HomeLoansReport });
    } catch (error) {
        res.status(500).json({ message: "Error creating loan report", error: error.message });
    }
}

exports.getAllHomeReports = async (req,res)=>{
    try {
        const homeLoanReports = await HomeLoansReport.findAll();
       res.status(200).json({homeLoanReports:homeLoanReports})
    }catch(error){
        res.status(500).json({error:error})
    }
}