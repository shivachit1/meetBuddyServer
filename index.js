import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import {router} from './routes/index.js'
import { Event } from './model/event.js'
import logger from './logger.js'

const { ObjectId } = mongoose.Types;

dotenv.config()
const app = express();
const port = process.env.PORT || 3000;
const serverIpAddress = process.env.SERVER_IP_ADDRESS;
const dbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/meetBuddyDatabase';

// Middleware to parse JSON bodies
app.use(cors())
app.use(express.json());

// Defining route for the root path
app.use('/', router);

// Connect to MongoDB and start the server
mongoose.connect(dbUrl)
.then(() => {
  logger.info('Connected to MongoDB');
  app.listen(port, () => {
    logger.info(`Server is running at http://${serverIpAddress}:${port}`)
  });
})
.catch((err) => {
  logger.error('Failed to connect to MongoDB', err);
});