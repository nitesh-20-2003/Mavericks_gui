import React from "react";

import Wrapper from "../assets/Wrappers/DashBoardHero";
import { Link } from "react-router-dom";
import blog1 from '../assets/images/blog3.jpeg'
const DashBlog = () => {
  return (
    <Wrapper>
      <div className="w-[90vw] max-w-[1120px] mx-auto  "></div>
      <div className="">
        <div className="section-center about-center ">
          <article className="about-info">
            <div className="flex text-center justify-start">
              <h4 className="font-mono font-[900]  text-cyan-950  tracking-tighter mb-5">
                Our Blog
              </h4>
            </div>

            <p className="mt-6 text-stone-600 tracking-normal">
              Our recent field visit to School was a significant step in
              advancing our project on Indian Sign Language (ISL). The purpose
              of the visit was to understand how ISL is currently used in the
              school environment and to create awareness among students and
              teachers. During our time there, we conducted interactive sessions
              introducing basic ISL signs, enabling participants to engage in
              real-life scenarios such as greetings and common phrases. The
              enthusiasm of both students and teachers was inspiring, as many
              expressed interest in learning more about ISL to foster
              inclusivity. We observed that while there is a growing awareness
              of ISL, many hearing-impaired students still face challenges due
              to the lack of resources and trained professionals. Teachers
              highlighted the need for accessible learning tools and emphasized
              the importance of integrating ISL into the curriculum. One of the
              most memorable moments was a student’s feedback: “Learning these
              signs made me feel included and understood.” This reinforced the
              importance of our mission to bridge communication gaps through
              ISL. The visit also helped us identify gaps, such as limited ISL
              knowledge among educators and inadequate teaching materials, which
              we aim to address through our project. Overall, the field visit
              was a valuable learning experience that not only strengthened our
              understanding of the current scenario but also motivated us to
              work harder toward creating a more inclusive environment for
              hearing-impaired individuals.
            </p>
          </article>
          <div className="about-video  ">
            <img
              src={blog1}
              className="about-video-content rounded-[0.25rem] "
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default DashBlog;
