import React from "react";
import { DashBoardHero ,Whoare,DashDatasets,DashCourses,
  DashDicionary,DashRealTime,Footer,Stats
} from "../Components";
const Landing = () => {
  return (
    <div>
        <DashBoardHero />
        <Whoare />
        <Stats />
        <DashDatasets />
        <DashCourses />
        <DashDicionary />
        <DashRealTime />
        {/* <Footer /> */}
    </div>
  );
};

export default Landing;
