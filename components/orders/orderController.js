const { 
        Order, 
        Driver,
        Admin,
        Customer,
} = require('../../models/index');
const { dateFormatter, checkOrderRuleOfFiveMinutes } = require('../../lib/misc');


// CUSTOMER 
const createOrder = async (req, res) => {

    try {
        const { 
        user_id, 
        orderItems, 
        deliveryType, 
        additionalInformation, 
        store_id, 
        address, 
        totalAmount, 
    } = req.body;

    const timeOfDeliveryCreation = new Date();
    const formattedDate = dateFormatter(timeOfDeliveryCreation);
    const isAbleToCreate = await checkOrderRuleOfFiveMinutes(timeOfDeliveryCreation, user_id);
    const orderItemsTransformed = orderItems.map(({_id, quantity}) => ({product: _id, quantity}))
    
    if(!isAbleToCreate) {
        return res.status(406).json({message: 'Not Acceptable'});
    }
    
    await Order.create({
                    date: formattedDate, 
                    products: orderItemsTransformed,                     
                    deliveryType,
                    additionalInformation,
                    approved: false,
                    timeOfDelivery: new Date(),
                    address,
                    store: store_id,
                    user: user_id,
                    totalAmount
    })
    
    // order created, but it needs to be accepted from an admin...
     return res.status(201).json({message: 'Success'})
    
    } catch (err) {
        console.log('Err message ', err.message);
        return res.status(500).json({message: 'Something went wrong'});
    }
} 


const getOrdersHistoryByUserId = async (req, res) => { // customer
    // only can see accepted and rejected orders
    const ordersHistory = await Order
        .find({ user: req.user._id })
        .populate({path: 'products.id', model: 'Product'})
    
    const data = ordersHistory.map((order) => {
        // wrong destructuring, or what 
        const { products, ...rest } = order;
        // if we added total amount it is not necessary to calculate the total amount
        const o = rest._doc;

        // total amount on a database no need to calculate it
        // will be calculated on the frontend
        // and saved inside of a document
        const totalAmount = products.reduce((acc, product) => {
            const { id: { price }, quantity } = product;
            return acc += price * quantity;
         }, 0)
         
        return {order: o, totalAmount: totalAmount.toFixed(2)}

    })

    res.json({message: 'Success', result: data});
}


// ADMIN 

const listPendingOrders = async (req, res) => {
    // for a certain store, every store has different orders
    // if role is admin check witch store he works in
    const { _id } = req.user;
    const admin = await Admin.findOne({_id});
    const pendingOrders = await Order
            .find({status: /pending/, store: admin.worksIn})
            .sort({'date': 'asc'})
            .select('-store')
            .populate({
                path: 'user', 
                model: 'User', 
                select: '-address -password'
            })
    
    return res.json({results: pendingOrders});
}

// have to see all drivers that are free, to deliver the food
// driver can change the status of an order
const acceptAnOrder = async (req, res) => {
    // driver_id in body of request
    // 1) set time of an order
    // 2) additional message(maybe not)
    // 3) select a driver for a route and assign him
    // 4) Accept
    const { 
        order_id, 
        driver_id: driver, 
        timeOfDelivery, // Date type
    } = req.body;
    // do we need to create a separate entity or just update the timeOfDelivery
    // inside of a Order document

    const acceptedOrder = await Order.findOneAndUpdate(
        { _id: order_id },
        { 
            timeOfDelivery, 
            status: 'accepted', 
            driver,
            approved: true, 
        }
    )
    await Customer.findOneAndUpdate(
        { _id: acceptedOrder.user }, 
        { $inc: { numberOfPurchases: 1 }}
    )

    // notify both driver and a customer about an order
    // increase customer purchase by 1
    return res.status(200).json({message: 'Successfully accepted order', results: order_id})
};

// Are drivers working for a specific store
// or they are working like a separate company(agency) ?

// DRIVER

// put a taught into this
const getOrdersForDriver = async (req, res) => {
    // get orders for a specific driver 
    try {
        const orders = await Order.find({driver: req.user._id, status: /Accepted/});
        
        if (!orders.length) return res.status(404).json({message: 'Orders not found', results: orders});
        return res.status(200).json({message: 'Orders for driver are found', results: orders})
    } catch (err) {
        return res.status(500).json({message: 'Error on the server', results: null})
    }
    
};

const changeStatusOfOrder = async (req, res) => {
    try {
        const { order_id } = req.body;
        await Order.findOneAndUpdate(
        { _id: order_id },
        { status: 'delivered' }
    )
        await Driver.findOneAndUpdate({ _id: req.user._id }, { $inc: { numberOfSuccessfulDrives: 1 }})
        return res.status(200).json({message: 'Successfully updated order status', results: {}})
    } catch (err) {
       return res.status(500).json({message: 'Something went wrong ', results : null})
    }
};


module.exports = {
    createOrder,
    getOrdersHistoryByUserId,
    listPendingOrders,
    acceptAnOrder,
    changeStatusOfOrder,
    getOrdersForDriver,
}


// PRIORITY LEVEL


// 1) Is it good to create order as a separate collection (entity), answer is yes
// 2) USER FUNCTIONALITIES (create an order, view history of orders, view all products, cannot create more than 3 orders in five minutes)
// 3) Create a discount for products, create notifications for users(discounts),

