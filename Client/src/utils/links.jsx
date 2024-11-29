import React from "react";
import { MdDatasetLinked } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { MdOutlineRoomPreferences } from "react-icons/md";
import { BsPersonWorkspace } from "react-icons/bs";
import { IoHome } from "react-icons/io5";

const userId = localStorage.getItem("userId");
const links = [
  {
    text: "Home",
    path: "/",
    icon: <IoHome />,
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
    text: "Stats",
    path: "stats",
    icon: <IoStatsChartSharp />,
  },
  {
    text: "Profile",
    path: `/profile/${userId}`, // Dynamically pass userId here
    icon: <ImProfile />,
  },
  {
    text: "Your Space",
    path: "your space",
    icon: <BsPersonWorkspace />,
  },
];

export default links;
