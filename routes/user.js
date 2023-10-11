import express from 'express'
import passport from 'passport';

import { SignIn, SignUp } from '../controllers';
import { generateToken } from '../middlewares/auth';

const router = express.Router();

router.get('/orders', passport.authenticate('jwt', { session:false }), async (req, res) => {
    res.send(req.token);
});

router.post('/signIn', async (req,res)=> {
    // do validation in routes
    const {
        email,
        password
    } = req.body;
    
    // console.log('email and password is ', email, password);
    
    const result = await SignIn({
      email,
      password
    });

    // console.log('inside signin page')
    if(!result.message)
    {
        const token = generateToken(email);
        console.log('token is, ',token);
        res.status(200).send({
            message: token,
            user: result.user
        })


    }
    else{
        res.status(401).send({
            message:result.message
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

router.post('/signup', async (req,res) => {
	try{
        const {name,
		email,
		password,
        mobileNo
    } = req.body;

	const user= await SignUp(name,email, password, mobileNo);
    console.log('in route user is, ', user);
	res.send(user);
	}catch (error){
        console.log('user is ', error);

		console.log('there is some error')	
	}


})

export default router;
