 const { Driver, Order } = require("../../models/index");
 const { hash } = require("bcrypt");



// ADMIN


const createDriver = async (req, res) => {
    try {
        const { username, name, phone, email, password, gender, } = req.body;
        
        const hashedPassword = await hash('pass123', 10);

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
        console.log(err.message);
        return res.status(500).json({message: 'Failed to create a driver', result: null})
    }
};
const getDriver = async (req, res) => {
    try {
    console.log('Hit the get driver route');
    const { id: _id } = req.params;
    // const {id: _id} = req.query;
    console.log('Params ', req.params);
    console.log('Query ', req.query);
    // from a driver info
    // how to search for a specific driver
    // can I search trough a user(because it is saved in user collection) or a driver(same to save a document-)
    // answer: can search trough driver
    const driver = await Driver.findById({ _id });
    console.log('Driver ', driver);
    res.status(200).json({message: 'Successfully found a driver', results: driver});
    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: err.message, results: null});
    }
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