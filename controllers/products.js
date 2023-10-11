import Product from "../models/products"

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
export {AddProduct , GetProducts, DeleteProduct, EditProduct};
