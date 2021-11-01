const uuid=require('uuid');
const express=require('express');
const router=express.Router();
const config=require('./config');
const client=require('twilio')(config.accountSID,config.authToken);
router.get('/login',async(req,res)=>{
    try
    {
        const data=await client
        .verify
        .services(config.serviceID)
        .verifications
        .create({
            to:`+${req.query.phonenumber}`,
            channel:req.query.channel
        });
        return res.status(200).json({data});
    }
    catch(err)
    {
        console.error(err.message);
         return res.status(400).json({error:err});
    }
});
router.get('/verify',async(req,res)=>{
    try
    {
    const data=await client
    .verify
    .services(config.serviceID)
    .verificationChecks
    .create({
        to:`+${req.query.phonenumber}`,
        code:req.query.code
    });
    if(data.status=="approved")
    {
    return res.status(200).json({message:"Verified successfully"});
    }
    else
    {
        return res.status(200).json({message:"Enter correct otp"});
    } 
   }
    catch(err)
    {
        console.error(err.message);
        return res.status(400).json({error:err});
    }
})
module.exports=router;