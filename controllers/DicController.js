import Dic from "../models/DicModel.js";
import { StatusCodes } from "http-status-codes";

export const Allcharacters = async (req, res) => {
  try {
    const data = await Dic.find({});
    // console.log(data); 

    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};
