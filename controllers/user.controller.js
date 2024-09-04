const db = require('./../models/index'); 
const User = db.User; 
const bcrypt = require("bcrypt");

// Create a new user

exports.createUser = async (req, res) => {
    try {
        const { employeeId, name, email, mobile, address, password, designation, otp, department, workingMode, role, status } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user
        const newUser = await User.create({
            employeeId,
            name,
            email,
            mobile,
            address,
            password: hashedPassword, // Use the hashed password
            designation,
            otp,
            department,
            workingMode,
            role,
            status
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user.', error });
    }
};
// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users.', error });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user.', error });
    }
};

// Update a user by ID
exports.updateUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const { employeeId, name, email,mobile, address, password, designation, otp, department, workingMode, role, status } = req.body;
        console.log(req.body,"jjj")

        const [updated] = await User.update({
            employeeId,
            name,
            email,
            address,
            mobile,
            password, 
            designation,
            otp,
            department,
            workingMode,
            role,
            status
        }, {
            where: { id: userId }
        });

        if (!updated) {
            return res.status(404).json({ message: 'no field modified' });
        }

        const updatedUser = await User.findByPk(userId);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user.', error });
    }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const deleted = await User.destroy({
            where: { id: userId }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user.', error });
    }
};
