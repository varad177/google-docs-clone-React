import mongoose, { Mongoose, mongo } from "mongoose";

const Connection = async () =>{

    const url = process.env.MONGO_URL


    try {


    await   mongoose.connect(url , {useUnifiedTopology : true , useNewUrlParser : true })
    console.log("db connected succesfully");


        
    } catch (error) {
        
        console.log("error while connecting " , error);

    }
}

export default Connection