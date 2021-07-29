const express=require('express');
const bcrypt=require('bcrypt');
const router=express.Router();
const gravatar=require('gravatar');
const jwt=require('jsonwebtoken');
const Schema=require('../../models/Schema');
const config=require('config');

const {check,validationResult}=require('express-validator');

router.post('/',[
    check('username','name is required')
    .not()
    .isEmpty(),
    check('email','Please enter a email address').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6}),

],
async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }

    const{email,username,password}=req.body;

   try{
       //check for the email already exists
      let user=await Schema.findOne({email});
      if(user)
      {
          res.status(400).send('User already exists');
      }
     //creating gravatar
      const avatar=gravatar.url(email,{
          s:'200',
          r:'pg',
          d:'mm'
      });
      //creating the user in the database
     user=new Schema({
         username,
         email,
         avatar,
         password
     });
     //Password Hashing
   const salt=await bcrypt.genSalt(10);

   user.password=await bcrypt.hash(password,salt);

    await user.save();
    const payload={
        user:{
            id:user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn:360000},
        (err,token)=>{
            if(err)
            {
                throw err;
            } 
            res.status(200).json({token});
        });

   }
   catch(err){
     res.send(`Error: ${err}`);
   }

});

module.exports=router;