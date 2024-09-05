// controllers/taskController.js
const db = require('./../models/index');
const { Task, User, Lead }=db

exports.createTask = async (req, res) => {
  try {
    let { title, description, status, userId, leadId,createdDate,updatedDate,actionType,followUp } = req.body;
if(!createdDate){
  createdDate = new Date().toString();
}else{
  createdDate = new Date(createdDate).toString();
}
let followUpDate=new Date(followUp).toString()
    // Validate if user exists
    const user = await User.findByPk(userId);
    if (userId && !user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Validate if lead exists
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const task = await Task.create({ title, description, status,actionType, userId, leadId,createdDate,updatedDate,followUpDate });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  exports.getAllTasks = async (req, res) => {
    console.log('get all tasks')
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

  exports.getTaskById = async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id, {
        include: [
          { model: User, as: 'user', attributes: ['name'] },
          { model: Lead, as: 'lead', attributes: ['title'] }
        ]
      });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.updateTask = async (req, res) => {
    try {
      let { title, description, status, userId, leadId,createdDate,updatedDate,actionType,followUp} = req.body;
      if(!updatedDate){
        updatedDate = new Date().toString();
      }else{
        updatedDate = new Date(updatedDate).toString();
      }
  let followUpDate=new Date(followUp).toString()
      // Validate if user exists
      if (userId) {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }
  
      // Validate if lead exists
      if (leadId) {
        const lead = await Lead.findByPk(leadId);
        if (!lead) {
          return res.status(404).json({ message: 'Lead not found' });
        }
      }
  
      const [updated] = await Task.update({ title, description, status, actionType,followUpDate,userId, leadId,updatedDate,createdDate }, {
        where: { id: req.params.id }
      });
  
      if (updated) {
        const updatedTask = await Task.findByPk(req.params.id, {
          include: [
            { model: User, as: 'user', attributes: ['name'] },
            { model: Lead, as: 'lead', attributes: ['name'] }
          ]
        });
        res.status(200).json(updatedTask);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
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
  