import jwt from 'jsonwebtoken'
import { secretKey } from '../config/config';

const GenerateToken = (email) => {
  const token = jwt.sign({ email } , secretKey, { expiresIn: '100000s' })

  return token;
}

export default GenerateToken;
