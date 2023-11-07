const moment = require('moment');

const dateFormatter = (date) => {
    const localTimezone = date.toLocaleString('en-US', {timezone: 'Belgrade/Europe'});
    const formattedDate = moment.utc(localTimezone).toDate();
    return formattedDate;
};


const checkOrderRuleOfFiveMinutes = async (orderTime, user) => { 
    
    const formattedDate = dateFormatter(orderTime); // returns a date formatted
    const fiveMinutesBefore = new Date (formattedDate.getTime() - 1000 * 60 * 5);
    
    const orders = await Order.find(
        {
           user,
           date: { $gte: fiveMinutesBefore, $lt: formattedDate }
        })
        
        return orders.length > 2 ? false : true;
}


module.exports = {
    dateFormatter,
    checkOrderRuleOfFiveMinutes,
};