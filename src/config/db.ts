import mongoose from 'mongoose'

export const connectDB = async() =>{
    const mongoUri = process.env.MONGO_URI;
    try{

    if(!mongoUri){
        throw new Error ('MONGOURI is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('database connected successfully')

    }

    catch(err){
        console.log(`database has been not connected, ${err}`);
    }

}