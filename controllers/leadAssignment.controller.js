const db = require('./../models/index');
const { User, Lead, LeadAssignment } = db;

exports.assignLeads = async (req, res) => {
    const { leadIds, assignedBy, assignedDate, assignedToUserId } = req.body;

    try {
        // Check if the user exists
        const user = await User.findByPk(assignedToUserId);
        const adminOrManager = await User.findByPk(assignedBy);
        
        if (!user) {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        if (!adminOrManager || adminOrManager.role !== 'ROLE_ADMIN') {
            return res.status(403).json({ error: 'Only admins or managers can assign leads.' });
        }

        // Find all leads by provided IDs
        const leads = await Lead.findAll({
            where: {
                id: leadIds
            }
        });

        // Check if all leads were found
        if (leads.length !== leadIds.length) {
            return res.status(404).json({ error: 'Some leads not found.' });
        }
console.log(adminOrManager.id,"adminOrManager")
        // Prepare assignments with the provided or current date
        const assignments = leadIds.map(leadId => ({
            leadId,
            assignedToUserId: user.id,
            assignedByUserId:adminOrManager.id, 
            assignedDate: assignedDate ? new Date(assignedDate) : new Date()
        }));

        // Bulk create or update assignments
        await LeadAssignment.bulkCreate(assignments, {
            updateOnDuplicate: ['userId', 'assignedBy', 'assignedDate'],
        });

        return res.status(200).json({ message: 'Leads successfully assigned.',assignedTo:user,assignedBy:adminOrManager });
    } catch (error) {
        console.error('Error assigning leads:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};



//user
exports.getAssignedLeads = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Fetch leads assigned to the user
        const assignedLeads = await Lead.findAll({
            include: [
                {
                    model: LeadAssignment,
                    where: { assignedToUserId: userId },
                    attributes: ['assignedDate', 'assignedByUserId'],
                    include: [
                        {
                            model: User,
                            as: 'assignedBy',
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });

        // If no leads found, return an empty array
        if (!assignedLeads.length) {
            return res.status(200).json({ message: 'No leads assigned to this user.', leads: [] });
        }

        return res.status(200).json({ leads: assignedLeads });
    } catch (error) {
        console.error('Error fetching assigned leads:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};


exports.leadAssignmentList = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const leadAssignments = await LeadAssignment.findAll({
            where: {
                assignedByUserId: user.id
            },
        });
        return res.status(200).json({ leadAssignments });
    } catch (error) {
        console.error('Error fetching lead assignments:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};

exports.deleteAssignedLead = async (req, res) => {
    const { leadid } = req.params;
    try {
        const leadAssignment = await LeadAssignment.findOne({
            where: { leadId: leadid }
        });
        if (!leadAssignment) {
            return res.status(404).json({ message: 'Lead assignment not found' });
        }
        await leadAssignment.destroy();
        res.status(200).json({ message: 'Lead assignment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete lead assignment' });
    }
};


exports.getAssignedLeadsOfEmployee = (req, res) => {
    const { id } = req.params;

    LeadAssignment.findAll({
        where: {
            assignedToUserId: id
        },
        // include: [
        //     {
        //         model:Lead,
        //         as: 'lead',
        //         attributes: ['name']
        //     }
        // ]
    })
    .then((assignedLeads) => {
        if (!assignedLeads.length) {
            return res.status(200).json({ message: 'No leads assigned to this user.', leads: [] });
        }

        res.status(200).json({ leads: assignedLeads });
    })
    .catch(error => {
        console.error('Error fetching assigned leads:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    });
};

exports.updateMultipleLeads = async (req, res) => {
    const { leadIds, status } = req.body;

    try {
        // Validate input
        if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing lead IDs.' });
        }
        if (!status) {
            return res.status(400).json({ error: 'Status is required.' });
        }

        // Update the status for multiple leads
        const [updatedCount] = await LeadAssignment.update(
            { status },
            {
                where: {
                  leadId: leadIds
                }
            }
        );

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'No leads were updated. Please check the lead IDs.' });
        }

        return res.status(200).json({ message: 'Leads successfully updated.', updatedCount });
    } catch (error) {
        console.error('Error updating leads:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};


exports.update=async (req,res)=>{
    const { status } = req.body;
    const leadId = req.params.id;
    try {
        const updated = await LeadAssignment.update(
            { status },
            {
                where: {
                  leadId: leadId
                }
            }
        );
        return res.status(200).json({ message: 'Lead successfully updated.', updated });
    } catch (error) {
        console.error('Error updating leads:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
}