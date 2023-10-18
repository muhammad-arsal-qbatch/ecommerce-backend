import Product from '../models/products';

const AddProduct = async (prod) => {
    try{
        const product = new Product(prod);
        await product.save();

        return { product };
    }
    catch(error) {
        const err = new Error();
        err.message = 'error while adding the product';
        err.status = 400;
        throw err;
    }
}

const GetProducts = async (offset, limit, search, filterObj, sortingObj) => {
    try{
        let selector = {};

        if (filterObj?.price) {
            selector = {
                ...filterObj,
                price: { $gte: Number(filterObj.price[0]), $lte: Number(filterObj.price[1]) }
            }
        }

        if (search !== ''){
            const regex = new RegExp('^' + search, 'i');
            selector.productName = { $regex: regex };
        }
        const myProducts = await Product.find(selector).sort(sortingObj).skip(offset).limit(limit);

        return { myProducts };
    } catch(error) {
        throw new Error('error while getting the data', error)
    }
}

const DeleteProduct = async (product) => {
    try{
        const obj = await Product.deleteOne({_id: product._id});
        return { obj };
    }catch(error) {
        return { 'error':'error while deleting the product' };
    }
}
const EditProduct = async (editedProduct) => {
    try {
        const updatedProduct = {};
        console.log('final', editedProduct);
        for (const key in editedProduct) {
            if (
                editedProduct[key] === '' ||
                editedProduct[key].length === 0 ||
                editedProduct[key] === null
            ) {
                /* empty */
            } else {
                updatedProduct[key] = editedProduct[key];
            }
        }
        console.log('final edited product, ', updatedProduct); // Fix here

        const updatedObject = await Product.findByIdAndUpdate(editedProduct.id, updatedProduct, { new: true });
        return { updatedObject };

    } catch (error) {
        return { error: 'Product not found or could not be updated.' };
    }
};

const UpdateProductQuantities = async (products) => {
    try {
        for (const product of products) {
            const { _id, quantity } = product;
            const foundProduct = await Product.findById(_id);
            if (foundProduct) {
                foundProduct.quantity -= quantity;
                foundProduct.totalSold += quantity;

                await foundProduct.save();
            } else {
                console.log(`Product with _id ${ _id } not found.`);
            }
        }
        console.log('Product quantities updated successfully.');
    } catch (error) {
        throw new Error('error while updating products quanitties');
    }
};

const GetTopSellingProducts = async () => {
    try {
        const topSellingProducts = await Product.aggregate([
            {
                $group: {
                    _id: '$_id',
                    totalSold: { $sum: '$totalSold' },
                    quantity: { $first: '$quantity' },
                    price: { $first: '$price' },
                    productName: { $first: '$productName' },
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
