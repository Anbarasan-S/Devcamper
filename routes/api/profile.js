const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile');
const User=require('../../models/Schema');
const{check,validationResult}=require('express-validator');
const { isValidObjectId } = require('mongoose');
const { remove } = require('../../models/Profile');
router.get('/me',auth,async(req,res)=>{
         try{
           const profile=await Profile.findOne({user:req.user.id}).populate('User',['name','avatar']);
           if(!profile)
           {
               res.status(400).json({msg:'There is no profile for this user'});
           }
           res.json(profile);
          }
         catch(err)
         {
            console.error(err.message);
            res.status(500).send('Server Error');
         }
});

router.post('/',[
   auth, [
      check('status','Status is required')
      .not()
      .isEmpty(),
      check('skills','Skills is required')
      .not()
      .isEmpty()
]
],async(req,res)=>{
            const errors=validationResult(req);
            if(!errors.isEmpty())
            {
               return res.status(400).json({errors:errors.array()});
            }
        const{
           company,
           website,
           location,
           bio,
           status,
           skills,
           youtube,
           twitter,
           instagram,
           linkedin
        }=req.body;
        const profileField={};
        profileField.user=req.user.id;
        if(company)
        {
           profileField.company=company;
        }
        if(website)
        {
           profileField.website=website;
        }
         if(location)
         {
            profileField.location=location;
         }
         if(bio)
         {
            profileField.bio=bio;
         }
         if(status)
         {
            profileField.status=status;
         }
         if(skills)
         {
            profileField.skills=skills.split(',').map(skills=>skills.trim());
         }
        profileField.social={};
        if(youtube)
        {
           profileField.social.youtube=youtube;
        }
        if(twitter)
        {
           profileField.social.twitter=twitter;
        }
        if(instagram)
        {
           profileField.social.instagram=instagram;
        }
        if(linkedin)
        {
           profileField.social.linkedin=linkedin;
        }
         try
         {
             let profile=await Profile.findOne({user:req.id});
             if(profile)
             {
               profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileField},{new:true})
               return res.json(profile);
             }
             profile=new Profile(profileField);
             await profile.save();
             return res.json(profile);
              
         }
       catch(err)
       {
          console.error(err.message);
         res.status(500).send('Server Error');
      }
});
router.get('/',async(req,res)=>{
   try
   {   
      let profiles=await Profile.find().populate('user',['username','avatar','email']);
      res.json(profiles);
   }
   catch(err)
   {
      console.error(err.message);
      return res.status(500).send('Server Error');
   }
});
router.get('/user/:id',async(req,res)=>{
   try
   {   
      let profile=await Profile.findOne({user:req.params.id}).populate('user',['username','avatar','email']);
      if(profile)
      return res.json(profile);
      else
     return res.status(400).send('Profile Not found ');
   }
   catch(err)
   {
      console.error(err.message);
      return res.status(500).send('Server Error');
   }
});
router.delete('/experience',auth,async(req,res)=>{
   try{
      await Profile.findOneAndRemove({user:req.user.id});
      await User.findOneAndRemove({_id:req.user.id});
      return res.status(200).json({msg:'User Deleted'});
   }
   catch(err)
   {
     return res.status(500).json({error:err});
   }
});


router.put('/',auth,async(req,res)=>{
   let profile=await Profile.findOne({user:req.user.id});
   try
   {
   if(!profile)
   {
      res.status(400).json({msg:'No profile found'});
   }
   const{
      title,
      company,
      location,
      from,
      to,
      current,
      description
   }=req.body;
   const newExp={
      title,
      company,
      location,
      from,
      to,
      current,
      description
   };
   profile.experience.unshift(newExp);
   await profile.save();
   res.status(200).json(profile);
   }
   catch(err)
   {
      console.error(err.message);
      res.status(500).json({msg:err});
   }
});
router.delete('/experience/:exp_id',auth,async(req,res)=>{
   try
   {
      const profile=await Profile.findOne({user:req.user.id});
      const removeExperience=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
      profile.experience.splice(removeExperience,1);
      await profile.save();
      return res.status(200).json({profile});
  }
   catch(err)
   {
      console.error(err.message);
      res.status(500).json({error:err.message});
   }
})

router.put('/education',[auth,
[check('school','School field is required').not().isEmpty(),
check('degree','Degree field is required').not().isEmpty(),
check('fieldofstudy','Field of study is required').not().isEmpty(),
check('degree','Date field is required').not().isEmpty(),
check('from','From field is required').not().isEmpty()
]]
,async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
       return res.status(400).json({errors:errors.array()});
    }
    const{
       school,
       degree,
       fieldofstudy,
       from,
       to,
       current,
       description
    }=req.body;
    try
   {
   let profile=await Profile.findOne({user:req.user.id});
   if(!profile)
   {
      res.status(400).json({message:"Profile not found"});
   }
   const education={school,degree,fieldofstudy,from,to,current,description};
   profile.education.push(education);
   await profile.save();
   return res.status(200).json({profile});
   }
   catch(err)
   {
    console.error(err.message);
    res.status(500).json({error:err});
   }
});

router.delete('/education/:ed_id',auth,async(req,res)=>{
      try
   { 
      let profile=await Profile.findOne({user:req.user.id});
      if(!profile)
      {
         res.status(400).json({message:"Profile not found"});
      }
      const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.ed_id);
      if(removeIndex!=-1)
      {
         profile.education.splice(removeIndex,1);
      }
      await profile.save();
      return res.status(200).json(profile);
   }
   catch(err)
   {
      console.error(err.message);
      return res.status(500).json({err});
   }


}
);

module.exports=router;