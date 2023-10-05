import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import { secretKey } from '../config/config';

const hashPassword =async (password) =>{
  console.log('inside hashed password function');
  const saltRounds=10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);


}

const generateToken = (email) =>{
  const token=jwt.sign({email, j:'1212'} , secretKey, {expiresIn:'10000s'})
  console.log(token);
  return token;
  // p.then((token)=>{
  //   return token;
  // }).catch((error)=>{
  //   return error;
  // })
//   (err,token)=>{
//     if(err)
//     {
//         console.log('errorrr');
//         return err;        
//     }
//     else{
//         console.log('sdssdsds');
//         return token;

//     }
// })
  
}
const validateToken = (req, res, next)=>{
  // we will use passport package to verify a token
  console.log('inside validate token');
  const token= req.headers['authorization'];
  console.log(token);
  if(token!==undefined)
  {
    req.token= token;
    next();
  }
  else{
    res.status(401).send('token is not valid');
  }


}

export  {hashPassword, generateToken, validateToken} ;
