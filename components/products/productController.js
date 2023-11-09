const { Product } = require('../../models/index');

// also an image will be uploaded for a product, but not mandatory
const createProduct =  async (req, res) => {}; // admin


const getAllProducts = async (req, res) => {

    const [ products, totalNumberOfProducts, categories ] = await Promise.all([
        Product
        .find({}),
        Product.find({}).count(),
        Product.distinct('category')
    ])
    return res.status(200).json({message: 'Products successfully fetched', results: {products, totalNumberOfProducts, categories }});
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id});
        if (!product) return res.status(404).json({message: 'Product not found', results: {}})
    } catch (err) {
        return res.status(500).json({message: err.message, results: null });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            _id,
            ...rest
        } = req.body;

        await Product.findByIdAndUpdate({ _id }, { ...rest });
        res.status(200).json({message: 'Product updated successfully', results: {}})
    } catch (err) {
        res.status(500).json({message: err.message, results: null});
    }
};

const getTopSoldProducts = async (req, res) => {

    const products = await Product
        .find({})
        .sort({numberOfSales: -1})
        .limit(5)
        
    return res.status(200).json({message: 'Success', results: products}); 
}


const calculateSellingStatistics = async (req, res) => {

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
    getProductById,
    updateProduct,
    getTopSoldProducts,
    calculateSellingStatistics,
    createProduct
}