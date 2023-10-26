const { User } = require('../models/index');


const permissionAccess = async (req, res, next) => {    
    const { _id } = req.user;
    const user = await User.findOne({ _id }); 
    
    if(!user) return res.status(404).json({message: 'User not found'});
    if (!user.isActive) return res.status(403).json({message: 'User is not active'})
    
    req.user = { _id, username: user.username, role: user.role }
    next(); 
}


module.exports = {
    permissionAccess,
}