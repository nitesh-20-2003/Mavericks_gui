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

const links = [
  {
    text: "Home",
    path: ".",
    icon: <IoHome />,
  },
  {
    text:"create",
    path:"create",
    icon:<VscGitPullRequestCreate />,
  },
  {
    text: "Dictionary",
    path: "dictionary",
    icon: <IoIosBookmarks />,
  },
  {
    text: "predict",
    path: "predict",
    icon: <BsWebcamFill />,
  },
  {
    text: "About Us",
    path: "about",
    icon: <MdOutlineRoomPreferences />,
  },
  {
    text: "Datasets",
    path: "Datasets",
    icon: <MdDatasetLinked />,
  },

  {
    text: "Profile",
    path: `/profile`,
    icon: <ImProfile />,
  },
  
];

export default links;
