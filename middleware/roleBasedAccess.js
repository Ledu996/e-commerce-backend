
const roleBasedAccessControl = (...roles) => { 
    return function (req, res, next) {
        if(!roles.includes(req.user.role)) return res.status(403).json({message: 'Not a right role'})
        next();
    }
}

module.exports = {
    roleBasedAccessControl
}