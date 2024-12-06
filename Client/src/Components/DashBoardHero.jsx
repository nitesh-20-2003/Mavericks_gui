import React from "react";
import landingVideo from "../assets/landingVideo.mp4";
import Wrapper from "../assets/Wrappers/DashBoardHero";
import { Link } from "react-router-dom";
const DashBoardHero = () => {
  return (
    <Wrapper>
      <div className="w-[90vw] max-w-[1120px] mx-auto ">
        <div className="flex text-center justify-start mt-[-4rem] mb-[11rem]">
          <h3 className="font-mono font-[900]  text-teal-950  tracking-tight leading-loose ">
            Empowering Indian Sign Language with MAVERICS
          </h3>
        </div>
      </div>

      <div className="section-center about-center ">
        <article className="about-info">
          <div className="flex text-center justify-start">
            <h4 className="font-mono font-[900]  text-cyan-950  tracking-tighter">
              Together, We Make a Difference
            </h4>
          </div>

          <p className="mt-6 text-stone-600 tracking-normal">
            Indiansignlanguage.org offers a huge collection of Indian Sign
            Language (ISL) signs. Each sign has an image, running video and
            threaded discussions. It is an ideal resource to use while you
            learn/teach Indian Sign Language. Each sign has an image, running
            video and threaded discussions. We are continually adding more signs
            and designing new services to empower the Deaf. Please share your
            ideas and comments and help us make this service better. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Iure velit temporibus
            impedit eaque minima vero ab aspernatur suscipit ea a. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Sequi reprehenderit
            beatae totam amet ad voluptatibus omnis distinctio accusantium
            accusamus autem!
          </p>
          <Link className="btn btn-outline mt-7">Learn More</Link>
        </article>
        <div className="about-video ">
          <video
            src={landingVideo}
            className="about-video-content rounded-[0.25rem] "
            autoPlay
            loop
            muted
            playsInline
            
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default DashBoardHero;
