import express from 'express'
// import mongoose from 'mongoose';
// import {userSchema} from '../models/userSchema'
import { SignIn, SignUp } from '../controllers/auth';
import { generateToken } from '../middlewares/auth';
import passport from 'passport';
const router = express.Router();

// const userModel = mongoose.model('myUsers', userSchema)
// const myPreHook = function (req,res,next) {
//     if(req.params.email)
//     {
//         console.log('Request is : ',req.params.email);
//     }
//     next();
// }

router.get('/orders',passport.authenticate('jwt', {session:false}),async (req ,res)=>{
    

    res.send(req.token);

})

router.post('/signIn', async (req,res)=> {
    // do validation in routes
    const {
        email,
        password
    } = req.body;
    
    console.log(req.body);
    
    const result = await SignIn(email, password)
    if(result === 'Password Matched')
    {
        const token = generateToken(email);
        console.log('token is, ',token);
        res.status(200).send({
            message:token
        })


    }
    else{
        res.status(401).send({
            message:result
        })

    }
    // console.log('result return is, ', result)
    // jwt.sign({email}, 'secretKey', {expiresIn:'10000s'},(err,token)=>{
    //     if(err)
    //     {
    //         console.log('errorrr');

    //         res.status(200).send({
    //             message:err 
    //         })        
    //     }
    //     else{
    //         console.log('sdssdsds');
    //         res.status(200).send({
    //             message:token 
    //         }) 

    //     }
    // })
     
    
})

router.post('/signUp', async (req,res) => {
	try{
        const {name,
		email,
		password} = req.body;

	const user= await SignUp(name,email, password);
	res.send(user);
	}catch (error){
		console.log('there is some error')	
	}


})

export default router;
