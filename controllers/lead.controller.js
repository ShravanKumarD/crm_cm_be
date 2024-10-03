const db = require("../models/index");
const Lead = db.Lead;

// Create a new lead
exports.createLead = async (req, res, next) => {

  try {
    const {
        assignedDate,
      name,
      phone,
      email,
      leadSource,
      dateImported,
      leadOwner,
      gender,
      dob,
      company,
      city,
      tags,
      status,
      userId,
    } = req.body;
    const newLead = await Lead.create({
      name,
      assignedDate,
      dateImported,
      phone,
      email,
      leadSource,
      leadOwner,
      gender,
      dob,
      company,
      city,
      tags,
      status,
      userId,
    });
    res.status(201).json({
      message: "Lead created successfully",
      lead: newLead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
};


exports.createBulkLeads = async (req, res) => {
  try {
    // Validate that req.body is an array of leads
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        message: "Invalid input. Please provide an array of leads.",
      });
    }

    // Create leads in bulk
    const leads = await Lead.bulkCreate(req.body, {
      validate: true,
    });

    res.status(201).json({
      message: "Leads created successfully",
      leads: leads,
    });
  } catch (error) {
    console.error("Error creating leads:", error);
    res.status(500).json({
      message: "Failed to create leads",
      error: error.message,
    });
  }
};


// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      include: [
        {
          model: db.Task,
          as: 'tasks',
          attributes: ['id', 'status', 'description', 'actionType', 'followUp', 'taskStatus'],
        },
      ],
    });
    res.status(200).json({
      leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

// Get a lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      lead,
    });
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  console.log('on lead')
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await Lead.update(updates, {
      where: { id },
      returning: true,
    });

    if (updated === 0) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const updatedLead = await Lead.findByPk(id);

    res.status(200).json({
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    // console.error('in updatelead', error);
    res.status(500).json({
      message: "Failed to update lead",
      error: error.message,
    });
  }
};



exports.updateLeadinBulk = async (req, res) => {
  try {
    const { id, action } = req.params; // For route parameters
    // const { id, action } = req.query; // For query parameters

    const updates = req.body;

    if (id) {
      // Single lead update
      const [updated] = await Lead.update(updates, {
        where: { id },
        returning: true,
      });

      if (updated === 0) {
        return res.status(404).json({
          message: "Lead not found",
        });
      }

      const updatedLead = await Lead.findByPk(id);

      return res.status(200).json({
        message: "Lead updated successfully",
        lead: updatedLead,
      });
    } else {
      // Bulk update
      if (!Array.isArray(updates)) {
        return res.status(400).json({
          message: "Bulk update payload must be an array of objects",
        });
      }

      const updatePromises = updates.map(async (update) => {
        const [updated] = await Lead.update(update, {
          where: { id: update.id },
          returning: true,
        });

        if (updated === 0) {
          return { id: update.id, status: "Lead not found" };
        }

        const updatedLead = await Lead.findByPk(update.id);
        return { id: update.id, status: "Lead updated successfully", lead: updatedLead };
      });

      const results = await Promise.all(updatePromises);

      return res.status(200).json({
        message: "Bulk update completed",
        results,
      });
    }

  } catch (error) {
    console.error("Error updating lead(s) in bulk:", error);
    res.status(500).json({
      message: "Failed to update lead(s)",
      error: error.message,
    });
  }
};



// exports.updateMultipleLeads = async (req, res) => {
//   const { leadIds, status } = req.body;
//   const assignedTo = Number(req.body.assignedTo);
//   const normalizedLeadIds = Array.isArray(leadIds) ? leadIds : [leadIds];
//   console.log(assignedTo,isNaN(assignedTo));
//   console.log(normalizedLeadIds,"normalizedLeadIds")
//   try { 

//     if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
//       console.log(!leadIds || !Array.isArray(leadIds) || leadIds.length === 0,'1')
//       return res.status(400).json({ error: 'Invalid or missing lead IDs.' });
//   }
//   if (!assignedTo || !Number.isInteger(assignedTo)) {
//       return res.status(400).json({ error: 'Assigned user ID must be a valid integer.' });
//   }
//   console.log("Normalized Lead IDs:", normalizedLeadIds); // Log the normalized lead IDs

//   const [updatedCount] = await Lead.update(
//     { assigned_to: assignedTo },
//     {
//       where: {
//         id: 1
//       },
//     }
//   );
  
//   console.log("Updated Count:", updatedCount); 
  
//   if (updatedCount === 0) {
//     console.log("No leads found with the provided IDs."); // More detailed logging
//     return res.status(404).json({ message: 'No leads were updated. Please check the lead IDs.' });
//   }
  

//     return res.status(200).json({ message: 'Leads successfully updated.', updatedCount });
//   } catch (error) {
//     console.error('Error updating leads:', error);
//     return res.status(500).json({ error: 'Internal server error.', details: error.message });
//   }
// };



exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Lead.destroy({
      where: { id },
    });

    if (deleted === 0) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

// Delete multiple leads
exports.deleteBulkLeads = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "No lead IDs provided or invalid format",
      });
    }
    const deletedCount = await Lead.destroy({
      where: {
        id: ids,
      },
    });
    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No leads found with the provided IDs",
      });
    }
    res.status(200).json({
      message: `${deletedCount} leads deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting bulk leads:", error);
    res.status(500).json({
      message: "Failed to delete bulk leads",
      error: error.message,
    });
  }
};


