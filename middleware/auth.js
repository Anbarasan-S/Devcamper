const jwt=require('jsonwebtoken');
const config=require('config');

 module.exports=(req,res,next)=>{
             const token=req.header('x-auth-token');
             if(!token)
             {
                 res.status(401).json({message:'No token, authorization denied'});
             }
             try
             {
                const id=jwt.verify(token,config.get('jwtSecret'));
                req.user=id.user;
                next();
             }
             catch(err)
             {
                       res.status(401).json({message:'Token is not valid'});            
             }     

}