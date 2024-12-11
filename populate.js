import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Course from './models/Course.js';
import Video from "./models/Video.js";
import Dic from './models/DicModel.js';
import Nmf from './models/Nmf.js'
try {
  await mongoose.connect(process.env.MONGO_URL);
  const jsonalphabet = JSON.parse(
    await readFile(new URL("./utils/videos.json", import.meta.url))
  );
  const alphabets = jsonalphabet.map((characters) => {
    return { ...characters};
  });
  await Video.deleteMany({});
  await Video.create(alphabets);
  console.log("Success!!!");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}












