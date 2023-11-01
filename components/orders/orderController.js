const { 
        Order, 
        paymentTypes, 
        deliveryTypes, 
        Store, 
        User 
} = require('../../models/index');
const { dateFormatter } = require('../../lib/misc');
const jwt = require("jsonwebtoken");


// CUSTOMER 

const getAddressAndShopsForOrder = async (req, res) => {
    try {
    const token = req.headers.authorization.split(' ')[1];
    const verified = await jwt.verify(token, 'secret');
    console.log(verified)
    const [ address, stores ] = await Promise.all(
        [
         User
         .findOne({_id: verified._id})
         .select('address'),
         Store.find({})
    ]
    );

    return res.status(200).json({
        message: 'Success', 
        results: {address, stores: [...stores], paymentTypes, deliveryTypes}
    });
    
}   catch (err) {
    return res.status(400).json({message: 'User has to be logged in', results: null})
}

};


const createOrder = async (req, res) => {
 console.log("Request-user", req.user); 
try {
    
    const { 
        user_id, 
        orderItems, 
        deliveryType, 
        additionalInformation, 
        store_id, 
        address, 
    } = req.body;

    const timeOfDeliveryCreation = new Date();
    const formattedDate = dateFormatter(timeOfDeliveryCreation);
    const isAbleToCreate = await checkOrderRuleOfFiveMinutes(timeOfDeliveryCreation, user_id);
    const orderItemsTransformed = orderItems.map(({_id, quantity}) => ({product: _id, quantity}))
    
    if(!isAbleToCreate) {
        return res.status(406).json({message: 'Not Acceptable'});
    }
    
   const order =  await Order.create({
                    date: formattedDate, 
                    products: orderItemsTransformed,                     
                    deliveryType,
                    additionalInformation,
                    approved: false,
                    timeOfDelivery: new Date(),
                    address,
                    store: store_id,
                    user: user_id,
    })
    
    // order created, but it needs to be accepted from an admin...

     return res.status(201).json({message: 'Success'})
    
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({message: 'Something went wrong'});
    }
} 


const getOrdersHistoryByUserId = async (req, res) => {
    // only can see accepted and rejected orders
    // in route of the endpoint specify the id 
    const ordersHistory = await Order
        .find({ user: req.user._id })
        .populate({path: 'products.id', model: 'Product'})
    
    //})
    
    const data = ordersHistory.map((order) => {
        // wrong destructuring, or what 
        const { products, ...rest } = order;
        // if we added total amount it is not necessary to calculate the total amount
        const o = rest._doc;
        const totalAmount = products.reduce((acc, product) => {
            const { id: { price }, quantity } = product;
            return acc += price * quantity;
         }, 0)
         
        return {order: o, totalAmount: totalAmount.toFixed(2)}

    })

    res.json({message: 'Success', result: data});
}


// helper function in order to create a new Order

async function checkOrderRuleOfFiveMinutes(orderTime, user) { 
    
    const formattedDate = dateFormatter(orderTime); // returns a date formatted
    const fiveMinutesBefore = new Date (formattedDate.getTime() - 1000 * 60 * 5);
    
    const orders = await Order.find(
        {
           user,
           date: { $gte: fiveMinutesBefore, $lt: formattedDate }
        })
        
        return orders.length > 2 ? false : true;
}


// ADMIN 

const listPendingOrders = async (req, res) => {
    // for a certain store, every store has different orders
    // if role is admin check witch store he works in
    const { store_id } = req.params;
    const pendingOrders = await Order
                .find({status: 'pending', store: store_id})
                .sort({'date': 'asc'})
    
    return res.json({results: pendingOrders});
}

// have to see all drivers that are free, to deliver the food
// driver can change the status of an order
const acceptAnOrder = async (req, res) => {
    // driver_id in body of request
    const { order_id, driver_id: driver } = req.body;
    const timeOfDelivery = new Date(Date.now() + 1000 * 60 * 30)
    const acceptAnOrder = await Order.findOneAndUpdate(
        { _id: order_id },
        { timeOfDelivery, status: 'accepted', driver  }
        // driver can change the status of an order to delivered
    )
    console.log(acceptAnOrder);
    
};

// DRIVER

const getOrdersForDriver = async (req, res) => {
    // get orders for a specific driver 
    try {
        const orders = await Order.find({driver: req.user._id, status: 'Accepted'});
        
        if (!orders.length) return res.status(404).json({message: 'Orders not found', results: orders});
        return res.status(200).json({message: 'Orders for driver are found', results: orders})
    } catch (err) {
        return res.status(500).json({message: 'Error on the server', results: null})
    }
    
};

const changeStatusOfOrder = async (req, res) => {
    await Order.findOneAndUpdate(
        {_id: orderId},
        {status: 'delivered'}
    ).populate({})
};


module.exports = {
    getAddressAndShopsForOrder,
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

