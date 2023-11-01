 const { Driver, Order } = require("../../models/index");
 const { hash } = require("bcrypt");

// ADMIN

const createDriver = async (req, res) => {
    try {
        const { username, name, phone, email, password, gender, } = req.body;
        
        const hashedPassword = await hash(password, 10);

        await Driver.create({
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword,
            name,
            phone,
            gender,
        })
        return res.status(201).json({message: 'Successfully created driver', result: {}})
    } catch (err) {
        
        return res.status(500).json({message: 'Failed to create a driver', result: null})
    }
};
const getDriver = async (req, res) => {

    try {
        const { id: _id } = req.params;
        const driver = await Driver.findById({ _id });
    
        res.status(200).json({message: 'Successfully found a driver', results: driver});
        } catch (err) {
        res.status(500).json({message: err.message, results: null});
    }
};


const updateDriver = async (req, res) => {
    try {
    const {id: _id} = req.params;
    const { username, name, phone, email, password  } = req.body;
    await Driver.findOneAndUpdate(
        { _id }, 
        {
            username, 
            name, 
            phone, 
            email, 
            password
        }
        )
        return res.status(303).json({message: 'Successfully updated driver', results: {}});
    } catch (err) {
        return res.status(500).json({message: err.message, results: null});
    }

};

const deleteDriver = async (req, res) => {
    try {
        const { id: _id } = req.params;
        await Driver.deleteOne({_id});
        return res.status(200).json({message: 'Successfully deleted driver', result: {}});
    } catch (err) {
        return res.status(500).json({message: 'Failed to delete driver', result: null});
    }
};

const getFreeDrivers = async (req, res) => {
    try {
        const freeDrivers = await Driver.find({status: 'free'});
        res.status(200).json({message: 'Successfully got an driver', results: freeDrivers});
    } catch (e) {
        res.status(500).json({message:'Error getting free driver', results: []});
    }
};


// DRIVER (add new Role)

const changeStatusToBusy = async (req, res) => {
    // find by id and update
    // specify the type
    await Driver.findOneAndUpdate({ _id: req.user._id }, { status: 'busy' });
    res.status(200).json({message: 'Changed status to busy'});
};
const changeStatusToFree = async (req, res) => {
    // find by id and update

    await Driver.findOneAndUpdate({_id: req.user._id }, {status: 'free'});

    res.status(200).json({message: 'Successfully changed status to free'});
};

// if driver is logged, he can change status of an order


// as name of the function is saying this should be in order controller
// but driver can confirm this


module.exports = {
    createDriver,
    getDriver,
    updateDriver,
    deleteDriver,
    getFreeDrivers,
    changeStatusToBusy,
    changeStatusToFree,
}