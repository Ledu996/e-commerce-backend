const moment = require('moment');

const dateFormatter = (date) => {
    const localTimezone = date.toLocaleString('en-US', {timezone: 'Belgrade/Europe'});
    const formattedDate = moment.utc(localTimezone).toDate();
    return formattedDate;
};

module.exports = {
    dateFormatter,
};