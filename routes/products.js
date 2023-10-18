import express from 'express';
import multer from 'multer';
import passport from 'passport';

import {
    DeleteProduct,
    EditProduct,
    GetProducts,
    GetTopSellingProducts,
    AddProduct
} from '../controllers';

const products = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

products.post('/addProduct',passport.authenticate('jwt', { session:false }), upload.any(), async (req, res) => {
    try {
        let upDatedProduct = req.body.newProduct;
        upDatedProduct.images = [];
        req.body.newProduct.images =[];

        req.files.map((updatedImagesPath) => {
            upDatedProduct.images.push(updatedImagesPath.path);
        });

        const response = await AddProduct(upDatedProduct);

        if (response.error) {
            return res.send({ error: response.error });
        }

        res.send(response);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

products.get('/getProducts', async (req,res) => {
    try{
        const {
            offset,
            limit,
            search,
            filterObj = {},
            sortingObj = {}
        } = req.query
        console.log('reequ', req.query);
        const response  = await GetProducts(
            offset,
            limit,
            search,
            filterObj,
            sortingObj
        );
        res.send({response});
    } catch(error) {
        res.send({ error });
    }
})

products.put('/editProduct',passport.authenticate('jwt', { session:false }),upload.any(), async (req,res) => {
    try{
        let updatedProduct = req.body.newProduct;
        updatedProduct.images = [];
        req.body.newProduct.images =[];

        req.files.map((updatedImagesPath) => {
            console.log(updatedImagesPath);
            updatedProduct.images.push(updatedImagesPath.path);
        });

        const response = await EditProduct(updatedProduct)
        if(response.error) {
            return res.send({ error:response.error })
        }
        res.send(response);

    } catch(error) {
        res.send({ error })
    }
})

products.delete('/deleteProduct',passport.authenticate('jwt', { session:false }), async (req,res) => {
    try{
        const response = await DeleteProduct(req.body.product);

        return res.send(response);
    } catch(error) {
        res.send({ error })
    }

})

products.get('/getTopSellingProducts',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try{
        const response = await GetTopSellingProducts();

        return res.send(response);
    } catch (err) {

        res.send(err)
    }
})

export default products;
