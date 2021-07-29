const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Post=require('../../models/Posts');
const Profile=require('../../models/Profile');
const Schema=require('../../models/Schema');
const{check,validationResult}=require('express-validator');
const Posts = require('../../models/Posts');
router.post('/',[auth,[
    check('text','Text is required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const user=await Schema.findById(req.user.id).select('-password');
    try 
    {
        const newPost=new Posts({
            text:req.body.text,
            name:user.username,
            avatar:user.avatar,
            user:req.user.id
        });
        await newPost.save();   
        return res.status(200).send('Post created');
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});
router.get('/',auth,async(req,res)=>{
    try
    {
      const posts=await Post.find().sort({date:-1});
      if(posts.isEmpty())
      {
         return res.status(404).json({msg:"No posts found"});
      }
       res.status(200).json({posts});
    }
    catch(err)
    {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
router.get('/:id',auth,async(req,res)=>{
    try {
          const post=await Post.findById(req.params.id);
          if(!post)
          {
              return res.status(404).json({msg:'Not Found'});
          }
             res.status(200).json({post});
      } catch (err) {
          console.error(err.message);
           if(err.kind==='ObjectId')
           return res.status(404).json({msg:"No posts with this id"});
          res.status(500).json({error:err});
      }
});
router.delete('/:id',auth,async(req,res)=>{
    try{
      const findPost=await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json({msg:"Post deleted Successfully"});
    }
    catch(err)
    {
       console.error(err.message);
       if(err.kind==='ObjectId')
       return res.status(404).json({msg:"No Posts with this id"});
       res.status(500).json({error:err});
    }
});
router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post=await Posts.findById(req.params.id);
        if(!post)
        {
            return res.status(404).send('No post found');
        }
        const like={
            user:req.user.id
        };
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0)
        {
            return res.status(400).json({msg:"Post already liked"});
        }
        post.likes.push(like);
        await post.save();
       res.status(200).json({post});
    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId')
        {
          return res.status(404).send('No post found');
        }
        res.status(500).send('Server Error');
    }
});
router.put('/unlike/:id',auth,async(req,res)=>{
    try {
        let post=await Posts.findById(req.params.id);
        if(!post)
        {
            return res.status(400).send('No post found');
        }
        const index=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        if(index==-1)
        {
            return res.status(400).json({msg:"Post not liked"});
        }
        post.likes.splice(index,1);
        await post.save();
        res.status(200).send('Like removed successfully ');
    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId')
        {
          return res.status(404).send('No post found');
        }
        res.status(500).send('Server Error');
    }
});
router.put('/comment/:id',[auth,
 [
   check('text','Comment is required').not().isEmpty()
]
],async(req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const post=await Posts.findById(req.params.id);
        const user=await Schema.findById(req.user.id).select('-password');
        const newComment=({
            text:req.body.text,
            name:user.username,
            avatar:user.avatar,
            user:req.user.id
        });
        if(!post)
        return res.status(400).send('Post not found');
        await post.comments.push(newComment);
        await post.save();
        res.status(200).json({post})
    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId')
        {
            return res.status(404).send('Invalid id');
        }
        res.status(500).json({error:err});
    }
});
router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
    try {
       const post=await Posts.findById(req.params.id);
       if(!post)
       {
           return res.status(400).json({msg:"No post with this id"});
       }
       const index=post.comments.map(item=>item._id).indexOf(req.params.comment_id);
       console.log(index);
       if(index===-1)
       {
           return res.status(400).send('No comments foundx');
       }
      post.comments.splice(index,1);
      await post.save();
        res.status(200).json({post});

    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId')
        {
            return res.status(404).send('Invalid id');
        }
        res.status(500).json({error:err});
    }
})
module.exports=router;