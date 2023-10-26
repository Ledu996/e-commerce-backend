const mongoose = require('mongoose');
const { Schema } = mongoose;

const typeOfEmployees = ['Manager', 'Driver', 'HR']; // etc ...
const seniorityNames = ['Junior', 'Medior', 'Senior'];

const EmployeeSchema = new Schema({
    name: String,
    personalEmail: String,
    corporateEmail: String,
    phoneNumber: String,
    startDateOfWork: Date,
    isWorking: Boolean,
    social: {
        facebook: String,
        linkedIn: String,
        reddit: String,
    },
    address: { type: Schema.Types.ObjectId, ref: 'address' },
    typeOfEmployee: String,
    seniority: { type: 'String', enum: seniorityNames },
    yearsWorking: Number,
});

// based on level of seniority and working years, employee will have some kind of progress, where he can track, 

// separate models for driver

module.exports = mongoose.model('Employee', EmployeeSchema);

// create driver as a separate entity