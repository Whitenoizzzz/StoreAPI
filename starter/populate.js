//This file is just to populate the database in onego
require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany() // to delete the previous data
        await Product.create(jsonProducts) //create also accepts an array
        process.exit(0)  //exits the process
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
start()