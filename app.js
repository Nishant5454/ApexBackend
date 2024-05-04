import express from "express"; 
import mongoose from "mongoose"; 
import jsonwebtoekn from "jsonwebtoekn";  
import CONNECTION from './connection/connection.js';
const PORT=3000; 
const app=express(); 
const URL="mongodb://localhost:27017"