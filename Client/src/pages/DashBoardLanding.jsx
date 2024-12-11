import React from "react";
import { DashBoardHero ,Whoare,DashDatasets,DashCourses,
  DashDicionary,DashRealTime,Footer,Stats,DashBlog,
  BlogGrid
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
        <DashBlog />
        <BlogGrid />
        {/* <Footer /> */}
    </div>
  );
};

export default Landing;
