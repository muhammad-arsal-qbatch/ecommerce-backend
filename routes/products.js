import express from 'express';
import { AddProduct } from '../controllers';
import { DeleteProduct, EditProduct, GetProducts, GetTopSellingProducts } from '../controllers/products';
const products = express.Router();

products.post('/addProduct', async(req,res)=>{
    try{
        console.log(req.body.newProduct.thumbnail);
        const response= await AddProduct(req.body.newProduct);
        if(response.error)
        {
            console.log('inside errorsssssrrr', response.error);
            return res.send({error: response.error});
        }
        res.send(response);
    }catch(error){
        res.send({error})
    }

})
products.get('/getProducts', async (req,res) => {
    try{
        console.log('inside route ', req.query.limit)
        const response  = await GetProducts(req.query.offset, req.query.limit);
        if(response.error)
        {
            res.send({error: response.error})
        }
        res.send({response});

    }catch(error){
        console.log({error});
        res.send({error});
    }
})

products.put('/editProduct', async(req,res)=>{
    try{
        console.log(req.body);
        const response = await EditProduct(req.body)
        console.log('in main route after calling controller \n\n', response);
        if(response.error){
            return res.send({error:response.error})
        }
        res.send({response});

    } catch(error){
        console.log('inside catch');
        res.send({error})
    }

})

products.delete('/deleteProduct', async(req,res)=>{
    try{
        console.log(req.body.product);
        const response = await DeleteProduct(req.body.product);
        return res.send(response);

    }catch(error){
        res.send({error})
    }

})
products.get('/getTopSellingProducts', async (req, res) => {
    try{
        console.log(' in api, data is ');

        const response = await GetTopSellingProducts();
        console.log(' in api, data is , ', response);
        return res.send(response);



    } catch (err) {
        // throw new Error('Erro while fetching top selling products ', err);
        res.send(err)
    }
})

export default products;
