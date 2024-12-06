import Dic from "../models/DicModel.js";
import { StatusCodes } from "http-status-codes";

export const Allcharacters = async (req, res) => {
  try {
    const data = await Dic.find({});
    
    // If you need pagination, uncomment the following:
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 9;
    // const skip = (page - 1) * limit;
    // const data = await Dic.find({}).skip(skip).limit(limit);
    // const totalJobs = await Dic.countDocuments({});
    // const numOfPages = Math.ceil(totalJobs / limit);

    // Send the response once:
    return res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};
