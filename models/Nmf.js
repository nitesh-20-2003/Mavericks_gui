import mongoose from "mongoose";

const NmfSchema = new mongoose.Schema(
  {
   categorie: {
       type: String,
       enum:["happy","sad","laugh","cry","surprise","angry","asking"],
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Nmf",NmfSchema );
