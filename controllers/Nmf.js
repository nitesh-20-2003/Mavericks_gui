import Nmf from "../models/Nmf.js";
import { StatusCodes } from "http-status-codes";

export const Allexpressions = async (req, res) => {
  try {
    const data = await Nmf.find({});
    // setup pagination:
    //  const page = Number(req.query.page) || 1;
    //  const limit = Number(req.query.limit) || 9;
    //  const skip = (page - 1) * limit;

    //  const jobs = await Dic.find({})
    //    .skip(skip)
    //    .limit(limit);

    //  const totalJobs = await Dic.countDocuments({});
    //  const numOfPages = Math.ceil(totalJobs / limit);
    res.status(StatusCodes.OK).json({ data });
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};
