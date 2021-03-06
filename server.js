const express=require('express');
const app=express();
const mongoose=require('mongoose');
require('dotenv').config();
const URI=process.env.MONGO_URI;
const db=require('./config/db');
db();
const routes=require('./routes/api/user');
const profileRoute=require('./routes/api/profile');
const auth=require('./routes/api/auth');
const otpRoute=require('./routes/api/otp');
const postRoute=require('./routes/api/post');
app.use(express.json({extended:false}));
app.use('/user',routes);
app.use('/api/auth',auth);  
app.use('/api/profiles',profileRoute);
app.use('/otp',otpRoute);
app.use('/api/posts',postRoute);
const port=process.env.PORT;
app.listen(port,()=>console.log('Connected'));