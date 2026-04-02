import mongoose from 'mongoose'
import logger from './logger';

export const connectDB = async() =>{
    const mongoUri = process.env.MONGO_URI;
    try{

    if(!mongoUri){
        throw new Error ('MONGO_URI is not defined');
    }
    await mongoose.connect(mongoUri);
    logger.info('database connected successfully')

    }

    catch (error) {
        logger.error('database has been not connected:', error);
        throw error;
    }
}
