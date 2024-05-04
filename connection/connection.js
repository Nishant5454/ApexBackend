import mongoose from "mongoose";
const Connection=async(URL)=>{ 
    try{ 
        const DB_OPTION={ 
            dbname:"Appex",
        }; 
        await mongoose.connect(URL,DB_OPTION); 
        console.log("Database Sucsessfully Connected to the Server");
    } 
    catch(err){ 
        console.log("Error  in the System");
    }
}; 
