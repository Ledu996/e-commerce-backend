 const { Driver, Order } = require("../../models/index");



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

const changeStatusToBusy = async (req, res) => {
    // find by id and update
    await Driver.findOneAndUpdate({ _id: req.user._id }, { status: 'busy' })
};
const changeStatusToFree = async (req, res) => {
    // find by id and update
    await Driver.findOneAndUpdate({ _id: req.user._id }, {status: 'free'});
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