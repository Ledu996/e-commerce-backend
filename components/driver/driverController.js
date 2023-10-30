 const { Driver, Order, User } = require("../../models/index");



// ADMIN

const createDriver = async (req, res) => {
    try {
        const { name, phone } = req.body;
        await Driver.create({
            name,
            phone,
        })
        res.status(201).json({message: 'Successfully created driver', result: {}})
    } catch (err) {

    }
};
const getDriver = (req, res) => {
    // from a driver info
};
const updateDriver = (req, res) => {};
const deleteDriver = (req, res) => {};

const getFreeDrivers = async (req, res) => {
    try {
        const freeDrivers = await Driver.find({status: 'free'});
        res.status(200).json({message: 'Successfully got an driver', results: freeDrivers});
    } catch (e) {
        res.status(500).json({message:'Error getting free driver', results: []});
    }
};


// DRIVER (add new Role)
// does not inherit the user's properties
// seems like user document is transformed not the driver
// OOP works differently

const changeStatusToBusy = async (req, res) => {
    console.log("Changing status to busy");
    // find by id and update
    const driver = await Driver.find({ _id: req.user.id}); // type: req.user.role
    console.log('Driver here ', driver);
    // specify the type
    await Driver.findOneAndUpdate({ _id: req.user._id }, { status: 'busy' });
    res.status(200).json({message: 'Changed status to busy'});
};
const changeStatusToFree = async (req, res) => {
    // find by id and update
    console.log('Changing status to free');
    console.log(req.user._id);
    await Driver.findOneAndUpdate({_id: req.user._id }, {status: 'free'});
    res.status(200).json({message: 'Successfully changed status to free'});
};

// if driver is logged, he can change status of an order

const changeStatusOfOrder = async (req, res) => {
    // when delivered change status, and increase totalDrives by one
    console.log(req.user);
    // order_id is crucial, maybe he changes the directions
    // match inside driver orders
    await Order.findOneAndUpdate(
        {status: 'pending', driverId: req.user._id }, 
        {status: 'delivered'}
    );
};

module.exports = {
    createDriver,
    getDriver,
    updateDriver,
    deleteDriver,
    getFreeDrivers,
    changeStatusToBusy,
    changeStatusToFree,
    changeStatusOfOrder,
}