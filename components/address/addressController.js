const { Address } = require('../../models/index');

const createAddress = async (req, res) => {
  try {
      const {
        street, 
        number, 
        municipality, 
        city, 
        apartmentNumber
    } = req.body;
        
    await Address.create({
            street, 
            number, 
            municipality, 
            city, 
            apartmentNumber
        }); 
        res.status(200).json({message: 'Successfully created address', results: {}})
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}
const updateAddress = async (req, res) => {
    try {    
        const { _id } = req.user;
        const {
            street, 
            number, 
            municipality, 
            city, 
            apartmentNumber
        } = req.body; 
        await Address.findOneAndUpdate({_id}, {...req.body});
        res.status(200).json({message: 'Successfully updated address', results: {}})
    } catch (err) {
        res.status(500).json({message: err.message, results: null});
    }
    
};
const getAddress = async (req, res) => {
    try {
        const address = await Address.findOne({_id: req.params.id});
        if(!address) return res.status(404).json({message: 'Address not found', results: {}});
    } catch (err) {
        res.status(500).json({message: err.message, results: null});
    }
};
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.deleteOne({_id: req.params.id});
        res.status(200).json({message: 'Successfully deleted address', results: {}});
    } catch (err) {
        res.status(500).json({message: err.message, results: 'Failed to delete address', results: null});
    }
};

const getAllAddresses = async (req, res) => {
    const addresses = await Address.find({});
    res.status(200).json({
        message: 'Successfully retrieved all addresses', 
        results: addresses
    })
};

module.exports = {
    createAddress,
    updateAddress,
    getAddress,
    deleteAddress,
    getAllAddresses
}