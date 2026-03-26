import mongoose from 'mongoose'

export const connectDB = async() =>{
    const mongoUri = process.env.MONGO_URI;
    try{

    if(!mongoUri){
        throw new Error ('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('database connected successfully')

    }

    catch (error) {
        console.error('database has been not connected:', error);
    }
}