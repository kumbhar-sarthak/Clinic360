import dotenv from 'dotenv'
import connect from './config/db.js'
import app from './app.js'
import ThrowError from './utility/ErrorHandler.js'

dotenv.config({
  path: './.env',
  encoding: "utf8",
  debug: true,
})

connect()
.then(() => {
  app.listen(process.env.PORT || 5050 ,()=>{
    console.log(`Server listening on ${process.env.PORT}`)
  })
})
.catch((error)=>{
  throw new ThrowError(501,'Connection failed !!',error);
})
