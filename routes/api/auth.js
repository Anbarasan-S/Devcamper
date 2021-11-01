const express=require('express');
const router=express.Router();
const config=require('config');
const auth=require('../../middleware/auth');
const User=require('../../models/Schema');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const{check,validationResult}=require('express-validator');
router.get('/',auth,async(req,res)=>{
try{
    const user=await User.findById(req.user.id).select('-password');
    res.json(user);
}
catch(err)
{
    console.error(err.message);
    res.status(500).send('Server Error');
}
});

router.post('/',[
    check('email','Email not exists').isEmail(),
    check('password','Enter  password').exists()
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        res.json({errors:errors.array()}); 
    }
    const{email,password}=req.body;
    try
    {
       let user=await User.findOne('email');
       if(!user)
       {
         res
         .status(400)
         .json({errors:[{msg:'Invalid credentials'}]});
       } 
       else
       {
          if(!(await bcrypt.compare(password,user.password)))
          {
              return res
              .status(400)
              .json({errors:[{msg:'Invalid credentials'}]});
          }
          const payload={
              user:{
                  id:user.id
              }
          }
          jwt.sign(payload,
            config.get('jwtSecret'),
          {expiresIn:36000},
          (err,token)=>{
              if(err)
              throw err;
              res.json({token});
          }
          );
       }
    }
    catch(err)
    {
         res.json({errors:[{msg:err}]});
    }
})

module.exports=router;