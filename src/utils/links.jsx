import React from "react";
import { MdDatasetLinked } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { MdOutlineRoomPreferences } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
const links = [
  {
    text: "Home",
    path: "/",
    icon: <IoHome />,
  },
  {
    text: "Datasets",
    path: "Datasets",
    icon: <MdDatasetLinked />,
  },
  {
    text: "stats",
    path: "stats",
    icon: <IoStatsChartSharp />,
  },
  {
    text: "profile",
    path: "profile",
    icon: <ImProfile />,
  },
  {
    text: "Your space",
    path: "your space",
    icon: <BsPersonWorkspace />,
  },
];
export default links;