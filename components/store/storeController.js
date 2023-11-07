const { Store } = require('../../models/index');


const createStore = async (req, res) => {
  try {
        const {
            name, 
            workingHours: { from, to },
            address,
        } = req.body;
        
        const store = await Store.create({
            name,
            workingHours: { from, to },
            address,
            managers: [], // managers, workers, driver(employees)
        })
        return res.status(200).json({message: 'Stored successfully created', result: store})
    } catch (err) {
        return res.status(500).json({message: 'Failed to create store', results: null })
    }
}; // admin
const getStore = async (req, res) => {
    try {
          const { id: _id }  = req.params;
          const store = await Store.findOne({_id});
        
          return res.status(200).json({message: "Successfully created store", results: store});
    } catch (err) {
        return res.status(500).json({message: "Failed to get a store", result: null})
    }
}; // user, admin 

const updateStore = async (req, res) => {
    try {
        const {store_id :_id, name, workingHours: {from, to}, address, managers} = req.body;
        await Store.findByIdAndUpdate(
            { _id }, 
            {
                name, 
                workingHours: { from, to },
                address,
            }
        )
        res.status(200).json({message: 'Successfully updated store', results: {}})
    } catch (err) {
        res.status(500).json({message: err.message, results: null});
    }
}; //admin
const deleteStore = async (req, res) => {
    try {
        const { id: _id } = req.params;
        await Store.deleteOne({_id});
        res.status(200).json({message: 'Successfully deleted store', results: {}});
    } catch (err) {
        res.status(500).json({message: err.message, results: null});
    }
}; // admin

const getAllStores = async (req, res) => {
    try {
        const stores = await Store.find({});
        res.status(200).json({message: 'Successfully found stores', results: stores});
    } catch (err) {
        return res.status(500).json({message: err.message, results: null});
    }
}; // customer, admin


module.exports = {
    createStore,
    getStore,
    updateStore,
    deleteStore,
    getAllStores,
}