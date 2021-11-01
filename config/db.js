const mongoose=require('mongoose');
const config=require('config');
const db=config.get('MONGO_URI');
const connectDb=async()=>{

  try{
    await mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
  });
    console.log('mongodb connected');
}
  catch(err)
  {
      console.log(`error:${err.message}`);
      process.exit(1);
  }
}

module.exports=connectDb;
