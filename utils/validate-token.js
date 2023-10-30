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

export default ValidateToken;
