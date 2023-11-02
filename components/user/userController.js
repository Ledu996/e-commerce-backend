const { User } = require('../../models/index');

// CREATE AN API DOCUMENTATION USING SWAGGER THAT IS FOR LATER

// Customer and Driver functionality 
// Admins are already registered inside of a system





// see what we will do for this
const createUser = async (req, res) => {};


const updateUser = async (req, res) => {
    try {
    const { _id } = req.user;
    const {
        firstname,
        lastname,
        username, 
        password, 
        email, 
        address, 
        phone, 
        dateOfBirth
    } = req.body;
    
    await User.findOneAndUpdate({ _id }, { ...req.body });
    return res.status(201).json({message: 'Successfully updated user'});
    } catch (err) {
        return res.status(500).json({message: 'Failed to update user'});
    }
};

const deleteUser = async (req, res) => {
    const { _id } = req.user;
    try {
        await User.deleteOne({ _id });
        return res.status(200).json({message: 'Successfully deleted user', results: {}})
    } catch (e) {
        return res.status(500).json({message: 'Failed deleting user', results: null});
    }
};

const getUserById = async (req, res) => {
    const { id: _id } = req.params;
    const user = await User.findOne({ _id});
    if (!user) return res.status(404).json({message: 'User not found', results: null});
    return res.status(200).json({message: 'Success', results: user});
}; 


module.exports = {
    getUserById,
    deleteUser,
    updateUser,
}