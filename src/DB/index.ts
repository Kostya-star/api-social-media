import mongoose from 'mongoose';
import { DatabasesNames } from './config';

const MONGO_URI = process.env.MONGO_URI || '';
const dbName = DatabasesNames.INCUBATOR_BLOGS;
const connection = `${MONGO_URI}/${dbName}`;

export async function connectToDb() {
  try {
    console.log(connection)
    await mongoose.connect(connection);
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.log('Could not connect to MongoDB!');
    console.error(err);
    await mongoose.disconnect();
  }
}
// connectToDb().then(() => {}).catch(console.dir);
