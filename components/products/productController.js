const { Product } = require('../../models/index');

// also an image will be uploaded for a product, but not mandatory
const createProduct =  async (req, res) => {};


const getAllProducts = async (req, res) => {

    const [ products, totalNumberOfProducts, categories ] = await Promise.all([
        Product
        .find({}),
        Product.find({}).count(),
        Product.distinct('category')
    ])
    return res.status(200).json({message: 'Products successfully fetched', results: {products, totalNumberOfProducts, categories }});
}

const getTopSoldProducts = async (req, res) => {

    const products = await Product
        .find({})
        .sort({numberOfSales: -1})
        .limit(5)
        
    return res.status(200).json({message: 'Success', results: products}); 
}


const calculateSeelingStatistics = async (req, res) => {
    console.log('Getting statistics');

    const products = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                totalSales: {$sum: '$numberOfSales'}
            },

        },
        {
            $sort: {totalSales: -1}
        }
    ])
    
    res.status(200).json({message: 'Success', results: products});
};





module.exports = {
    getAllProducts,
    getTopSoldProducts,
    calculateSeelingStatistics
}