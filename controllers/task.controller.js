// controllers/taskController.js
const db = require('./../models/index');
const { Task, User, Lead }=db

exports.createTask = async (req, res) => {
  try {
    const { 
      description, 
      status, 
      userId, 
      leadId,
      company,    
      city, 
      email, 
      createdDate, 
      updatedDate, 
      docsCollected, 
      actionType, 
      followUp 
    } = req.body;


    const createdDateString = createdDate ? new Date(createdDate).toISOString() : new Date().toISOString();
    const followUpDate = followUp ? new Date(followUp).toISOString() : null;
    const user = await User.findByPk(userId);
    if (userId && !user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const task = await Task.create({ 
      description:description, 
      status:status, 
      actionType:actionType,
      docsCollected:docsCollected, 
      userId :userId, 
      leadId:leadId, 
      createdDate: createdDateString,
      updatedDate:updatedDate, 
      followUp: followUpDate
    });
    console.log(task,"task")
    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
};




  exports.getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.findAll({
        include: [
          { model: User, as: 'user', attributes: ['name'] },
          { model: Lead, as: 'lead', attributes: ['name','phone','email','assignedDate','city','status'] }
        ]
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getTasksByUserId = async (req, res) => {
    try {
      // const userId = req.params.userId;
        const { id } = req.params;
       let user =await User.findByPk(id);
      
        if (!user.id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch tasks associated with the specified userId
        let uId = user.id
        const tasks = await Task.findAll({
            where: {  
              userId:uId},
            include: [
                { model: User, as: 'user', attributes: ['id', 'name'] },
                { model: Lead, as: 'lead', attributes: ['id', 'name'] }  
            ]
        });

        if (!tasks.length) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  exports.  updateTask = async (req, res) => {//update  by userid
    try {
      const { description, status,city,email, company,userId, leadId, createdDate,docsCollected, updatedDate, actionType, followUp,taskStatus } = req.body;
      console.log(req.body,req.params.id,"req.body")
  
      const updatedDateString = updatedDate ? new Date(updatedDate).toString() : new Date().toString();
      const followUpDate = followUp ? new Date(followUp).toString() : null;
   console.log(taskStatus,leadId,userId,"sejbfwehbferfg")
      if (userId) {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }
  
      if (leadId) {
        const lead = await Lead.findByPk(leadId);
        if (!lead) {
          return res.status(404).json({ message: 'Lead not found' });
        }
      }
  
      const [updated] = await Task.update(
        { description, status, actionType,
          taskStatus:taskStatus
          , followUpDate,docsCollected:docsCollected, userId, leadId, updatedDate: updatedDateString, createdDate },
        { where: { id: req.params.id } }
      );
      console.log(updated,"updated")
      // if (updated) {
      //   const [updatedLead] = await Lead.update(
      //     { status:status,
      //       company:company,
      //       city:city,
      //       email:email,
      //      }, 
      //     { where: { id: leadId } }
      //   );

      //   const updatedTask = await Task.findByPk(req.params.id, {
      //     include: [
      //       { model: User, as: 'user', attributes: ['id'] },
      //       { model: Lead, as: 'lead', attributes: ['id'] }
      //     ]
      //   });
  
      //   res.status(200).json({ task: updatedTask, lead: updatedLead });
      // } else {
      //   res.status(404).json({ message: 'Task not found' });
      // }
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.deleteTask = async (req, res) => {
    try {
      const deleted = await Task.destroy({
        where: { id: req.params.id }
      });
  
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  