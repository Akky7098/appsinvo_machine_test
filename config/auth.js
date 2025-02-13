const jwt = require("jsonwebtoken")
const Jwt_secret = 'abc123'
exports.verifyToken = async(req,res,next) =>{

     const token = req.headers.authorization?.split(' ')[1];
    try{
        if(!token){
           res.status(401).send({
              status:false,
              message:"access denied no token found"
           })
        }

           const decoded =  jwt.verify(token,Jwt_secret);

           req.user = decoded
           req.userLat = decoded.latitude;  
           req.userLon = decoded.longitude;  
           next();
}  catch(error){
  res.status(401).send({
     status:false,
     message:" token expired or invalid token"
  })
}
}
     