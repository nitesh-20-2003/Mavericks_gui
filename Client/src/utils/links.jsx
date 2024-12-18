import React from "react";
import { MdDatasetLinked } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { MdOutlineRoomPreferences } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { IoIosBookmarks } from "react-icons/io";
import { BsWebcamFill } from "react-icons/bs";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { RiVideoUploadFill } from "react-icons/ri";
import { MdMovieCreation } from "react-icons/md";
import { SiCoursera } from "react-icons/si";
// import { RiUserCommunityFill } from "react-icons/ri";
import { FaSortAlphaDown } from "react-icons/fa";
import { SiSemanticscholar } from "react-icons/si";
import { path } from "framer-motion/client";
import { FaTextHeight } from "react-icons/fa";

const links = [
  {
    text: "Home",
    path: ".",
    icon: <IoHome />,
  },
  {
    text: "Upload Video",
    path: "upload",
    icon: <RiVideoUploadFill />,
  },
  {
    text: "Dictionary",
    path: "dictionary",
    icon: <IoIosBookmarks />,
  },
  {
    text: "predict",
    path: "Prediction",
    icon: <BsWebcamFill />,
  },
  {
    text: "Courses",
    path: "courses",
    icon: <SiSemanticscholar />,
  },
  {
    text: "Dataset",
    path: "Datasets",
    icon: <MdDatasetLinked />,
  },
  {
    text: "Discussions",
    path: `discussions`,
    icon: <MdDatasetLinked />,
  },
  {
    text: "Create Dataset",
    path: "DataSetCreation",
    icon:<MdMovieCreation />,
  },
  {
    text: "Profile",
    path: "Profile",
    icon: <ImProfile />,
  },
  {
    text:"Sign Translator",
    path:"Sign",
    icon:<FaSortAlphaDown />,
  },
  {
    text:"text to sign",
    path:"TextToSign",
    icon :<FaTextHeight />,
  }
];

export default links;
