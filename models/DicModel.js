import mongoose from "mongoose";

const DicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
   description:{
    type:String,
    required:true,
   },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dic", DicSchema);
