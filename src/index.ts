require('dotenv').config();


import express, {Request, Response} from 'express';
import cors from 'cors';
import {routes} from "./routes";
import  {createConnection} from 'typeorm';
import cookieParser from 'cookie-parser';

createConnection().then(connection => {

const app = express()

app.use(express.json())
app.use(cookieParser());

//cors is for port configuration cause our app will run on different port 
// front port vs back port
app.use(cors({
    credentials: true, //cookie available in front
    origin: ["http://localhost:3000"]
}))

routes(app);

app.listen(8000, () => {
    console.log('listening to port 8000')
})

console.log('Hello 2u')

})
