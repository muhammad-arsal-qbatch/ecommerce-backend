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
    err.status = 401;
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
    else{
      selector = { ...filterObj };
    }
    if (search !== ''){
      const regex = new RegExp('^' + search, 'i');
      selector.productName = { $regex: regex };
    }
    const myProducts = await Product.find(selector).sort(sortingObj).skip(offset).limit(limit);
    return { myProducts };
  } catch(error) {
    throw new Error('error while getting the data')
  }
}

const DeleteProduct = async (product) => {
  try{
    const obj = await Product.deleteOne({_id: product._id});
    return { obj };
  }catch(error) {
    throw new Error ('error while deleting the product')
  }
}

const EditProduct = async (editedProduct) => {
  try {
    const updatedProduct = {};
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
    const updatedObject = await Product.findByIdAndUpdate(editedProduct.id, updatedProduct, { new: true });

    return { updatedObject };
  } catch (error) {
    throw new Error('Product not found or could not be updated.');
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
        throw new Error('Product not found')
      }
    }
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
    throw new Error('Error while fetching top selling products');
  }
};

const ImportBulkProducts = async (products) => {
  try{
    const response = await Product.insesrtMany(products);

    return response;
  } catch (error) {
    throw new Error('Error While importing bulk products');
  }
}

export {
    AddProduct,
    GetProducts,
    DeleteProduct,
    EditProduct,
    UpdateProductQuantities,
    GetTopSellingProducts,
    ImportBulkProducts
};
