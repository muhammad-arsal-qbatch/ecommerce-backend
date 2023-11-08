import express from 'express';
import multer from 'multer';
import passport from 'passport';
import fs from 'fs';
import path from 'path';

import {
    DeleteProduct,
    EditProduct,
    GetProducts,
    GetTopSellingProducts,
    AddProduct,
    ImportBulkProducts
} from '../controllers';

import DeleteFile from '../utils/delete-file';
import CatchResponse from '../utils/catch-response';

const products = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

const fileStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'file-uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now()+ '-'+ file.originalname);
  }
})

const upload2 = multer({ storage: fileStorage });

const upload = multer({ storage: storage });

products.post('/addProduct',passport.authenticate('jwt', { session:false }), upload.any(), async (req, res) => {
  try {
    let upDatedProduct = req.body.newProduct;
    const {productName, price, quantity} = upDatedProduct;
    if(productName === '' || price === '' || quantity === '')
      throw new Error('Please provide all details');

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
  } catch (err) {
    err.statusCode = 500;
    CatchResponse({ res, err });
  }
});

products.get('/getProducts', async (req,res) => {
  try{
    console.log('req.query ', req.query);
    const {
            offset= null,
            limit = null,
            search = '',
            filterObj = {},
            sortingObj = {}
        } = req.query
    const response  = await GetProducts(
            offset,
            limit,
            search,
            filterObj,
            sortingObj
        );
    res.send({response});
  } catch(err) {
    err.statusCode = 400;
    CatchResponse({ res, err });
  }
})

products.put('/editProduct',passport.authenticate('jwt', { session:false }),upload.any(), async (req,res) => {
  try{
    let updatedProduct = req.body.newProduct;
    updatedProduct.images = [];
    req.body.newProduct.images =[];

    req.files.map((updatedImagesPath) => {
      updatedProduct.images.push(updatedImagesPath.path);
    });

    const response = await EditProduct(updatedProduct)
    if(response.error) {
      return res.send({ error:response.error })
    }
    res.send(response);

  } catch(err) {
    err.statusCode = 400;
    CatchResponse({ res, err });
  }
})

products.delete('/deleteProduct',passport.authenticate('jwt', { session:false }), async (req,res) => {
  try{
    const response = await DeleteProduct(req.body);
    req.body.images.map(async (singleImage) => {
      const imagePath = path.join(__dirname,'..', singleImage);
      fs.unlink(imagePath , (error) => {
        if(error){
          console.log('error while deleting image from folder');
        }

      });

    })

    res.send(response);
  } catch(err) {
    err.statusCode = 400;
    CatchResponse({ res, err });
  }

})

products.get('/getTopSellingProducts',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try{
    const response = await GetTopSellingProducts();

    return res.send(response);
  } catch (err) {
    err.statusCode = 400;
    CatchResponse({ res, err });
  }
})

products.post('/importBulkProducts', upload2.any(), async (req, res) => {
  try{
    fs.readFile(req.files[0].path, async function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      const productsArray = JSON.parse(data);

      let newProducts  =[];
      for(let i = 0 ; i< productsArray.length ; i+= 1) {
        newProducts.push(productsArray[i]);
        if(newProducts.length ===5 ) {
          await ImportBulkProducts(newProducts);
          newProducts = [] ;
        }
      }

      if(newProducts.length) {
        await ImportBulkProducts(newProducts);
      }

      DeleteFile(req.files[0].path);
      res.write(data);
      return res.end();
    });

  } catch (err) {
    err.statusCode = 400;
    CatchResponse({ res, err });
  }
})

export default products;
