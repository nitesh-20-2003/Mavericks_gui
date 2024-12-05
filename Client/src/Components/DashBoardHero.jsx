import React from "react";
import landingVideo from "../assets/landingVideo.mp4";
import Wrapper from "../assets/Wrappers/DashBoardHero";

const DashBoardHero = () => {
  return (
    <Wrapper>
      <div className="section-center about-center ">
        
        <article className="about-info">
          <h3 className="font-mono font-[900]  text-cyan-950  tracking-widest">
            Empowering Indian Sign Language with MAVERICS
            
          </h3>
          <p className="mt-6 text-base">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta aut fugiat quos quae deleniti distinctio assumenda et dolore error, eaque, officiis impedit ad veniam. Accusantium cupiditate illum laborum eius, reprehenderit quidem animi officiis vitae aliquid aliquam minima temporibus ipsum repudiandae fugit! Incidunt vel explicabo tempore non error accusamus possimus minima iste cumque ipsum autem consequuntur dolores officia optio nisi, unde alias dignissimos voluptatibus ullam laudantium dolorum quasi laboriosam! Odit sed possimus suscipit a obcaecati unde iusto eum nesciunt vitae totam!
          </p>
        </article>
        <div className="about-video ">
          <video
            src={landingVideo}
            className="about-video-content rounded-[0.25rem] "
            autoPlay
            loop
            muted
            playsInline
            controls /* This adds video controls */
            controlsList="nodownload" /* This removes the download option */
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default DashBoardHero;
