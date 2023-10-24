import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import { secretKey } from '../config/config';


const HashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

const GenerateToken = (email) => {
    const token = jwt.sign({ email } , secretKey, { expiresIn: '100000s' })

    return token;
}
const ValidateToken = (req, res, next)=>{
    const token= req.headers['authorization'];
    if(token!==undefined)
    {
        req.token= token;
        next();
    }
    else{
        res.status(401).send('token is not valid');
    }
}

export  {
    HashPassword,
    GenerateToken,
    ValidateToken
} ;
