import Product from '../models/products'

const AddProduct = async(prod) => {
    try{
    // console.log({product});
        const product = new Product(prod);
        await product.save();
        return {product};
    }
    catch(error){
        const err = new Error()
        err.message = 'error while adding the product'
        err.status = 400
        throw err
        // return {'error': 'error while adding the product'}
    }

}
const GetProducts = async (offset, limit) => {
    try{
    // console.log('inside get p,', limit);
        const myProducts = await Product.find({}).skip(offset).limit(limit);
        // console.log('products are,, ', myProducts);
        return {myProducts};


    }catch(error){
        console.log('error hi error');
        return {'error':'error while getting the data'}
    }
}
const DeleteProduct = async (product) => {
    try{
        const obj = await Product.deleteOne({_id: product._id});
        console.log(obj);
        return {obj};


    }catch(error){
        return {'error':'error while deleting the product'}

    }
}
const EditProduct = async (editedProduct) => {
    try{
    // console.log({editedProduct});
        const updatedProduct= {};
        for(const key in editedProduct){
            if(editedProduct[key]==='' || editedProduct[key].length===0 || editedProduct[key] === null){ /* empty */ }
            else{
                updatedProduct[key]= editedProduct[key];


            }
        }
        const updatedObject = await Product.findByIdAndUpdate(editedProduct.id,updatedProduct,{new: true})
        return {updatedObject}

    }catch(error){

        return {error:'Product not found or could not be updated.'}
        //
    }
}

const UpdateProductQuantities = async (products) => {
    try {
        console.log('products are, ', products);
        for (const product of products) {
            const { _id, quantity } = product;

            const foundProduct = await Product.findById(_id);

            if (foundProduct) {
                foundProduct.quantity -= quantity;
                foundProduct.totalSold += quantity;

                await foundProduct.save();
            } else {
                console.log(`Product with _id ${_id} not found.`);
            }
        }

        console.log('Product quantities updated successfully.');
    } catch (error) {
        throw new Error('error while updating products quanitties');
    }
};
const GetTopSellingProducts = async () => {
    console.log('inside final of get toptal');
    try {
        const topSellingProducts = await Product.aggregate([
            {
                $group: {
                    _id: '$_id',
                    totalSold: { $sum: '$totalSold' },
                    quantity: {$addToSet: '$quantity'},
                    price: {$addToSet: '$price'},
                    productName: { $addToSet: '$productName' },
                }
            },
            {
                $sort: {
                    totalSold: -1
                }
            },
            {
                $limit: 7
            },
            {
                $project: {
                    _id: 0,
                    totalSold: 1,
                    quantity: 1,
                    price: 1,
                    productName: 1

                }
            }
        ]);

        console.log(topSellingProducts);
        return topSellingProducts;
    } catch (error) {
        console.error(error);
        throw error;
    }}

export {
    AddProduct,
    GetProducts,
    DeleteProduct,
    EditProduct,
    UpdateProductQuantities,
    GetTopSellingProducts
};
