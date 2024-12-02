import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Dic from './models/DicModel.js';
try {
  await mongoose.connect(process.env.MONGO_URL);
  const jsonalphabet = JSON.parse(
    await readFile(new URL("./utils/characters.json", import.meta.url))
  );
  const alphabets = jsonalphabet.map((characters) => {
    return { ...characters};
  });
  await Dic.deleteMany({});
  await Dic.create(alphabets);
  console.log("Success!!!");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
