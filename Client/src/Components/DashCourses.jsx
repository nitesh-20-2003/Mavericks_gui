import React from "react";
import image from "../assets/images/angry.jpg";
import Laugh from "../assets/images/Laugh.jpg";
import Sad from "../assets/images/sad.jpg";
import { Link } from "react-router-dom";
// icons
import { SiGooglescholar } from "react-icons/si";
import { MdArrowRightAlt } from "react-icons/md";
const DashCourses = () => {
  return (
    <div className=" mt-[10rem] w-[90vw] max-w-[1120px] mx-auto">
      <heading className="flex text-center justify-between mb-[0.8rem]">
        <div className="flex text-center justify-start">
          {/* dataset */}
          <span className="grid place-items-center mr-[0.2rem]">
            {/* Increase the icon size using text-[size] */}
            <SiGooglescholar className="text-[0.8rem] md:text-[1.8rem]" />
          </span>
          <div className="flex justify-center items-center">
            <h4 className="font-[500] font-mono ">Courses</h4>
          </div>
        </div>
        {/* viewall */}
        <Link className="btn" to="/dashboard/courses">
          <div className="flex text-center justify-end">
            <div className="flex justify-center items-center">
              <h6 className=" font-mono capitalize tracking-[-0.1rem]">
                View all
              </h6>
            </div>
            <span className="grid place-items-center mr-[0.2rem]">
              <MdArrowRightAlt className="text-[0.8rem] md:text-[1.8rem]" />
            </span>
          </div>
        </Link>
      </heading>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {/* 1st */}
        <div className="card lg:card-side bg-base-100 shadow-xl h-[10rem] w-[18rem]">
          <div className="card-body">
            <h2 className="card-title">Non Manual </h2>
            <div className="text-[0.8em]">
              <p>
                Non-manual features (NMFs) are critical elements of sign
                language communication that go beyond hand gestures to convey
                meaning. They include facial expressions, head movements, mouth
              </p>
            </div>

            <div className="card-actions justify-end"></div>
          </div>
          <figure className="mr-[1rem]">
            <img
              src={image}
              className="  hidden  md:block md:h-[45px] md:w-[220px] md:mr-[0.2rem] mask mask-circle "
              alt="Album"
            />
          </figure>
        </div>
        {/* 2nd */}

        <div className="card lg:card-side bg-base-100 shadow-xl h-[10rem] w-[18rem]">
          <div className="card-body">
            <h2 className="card-title leading-[1]">Spatial Features</h2>
            <div className="text-[0.8em]">
              <p>
                Spatial features are a fundamental aspect of sign language,
                using the space around the signer to add depth and clarity to
                communication.
              </p>
            </div>

            <div className="card-actions justify-end"></div>
          </div>
          <figure className="mr-[1rem]">
            <img
              src={Laugh}
              className="  hidden  md:block md:h-[45px] md:w-[220px] md:mr-[0.2rem] mask mask-circle "
              alt="Album"
            />
          </figure>
        </div>
        {/* 3rd */}
        <div className="card lg:card-side bg-base-100 shadow-xl h-[10rem] w-[18rem]">
          <div className="card-body">
            <h2 className="card-title  leading-[1]">Regional And Cultural</h2>
            <div className="text-[0.8em]">
              <p>
                Sign language is not a universal language; it reflects the
                regional and cultural identity of its users. Regional and
                cultural 
              </p>
            </div>

            <div className="card-actions justify-end"></div>
          </div>
          <figure className="mr-[1rem]">
            <img
              src={Sad}
              className="  hidden  md:block md:h-[45px] md:w-[220px] md:mr-[0.2rem] mask mask-circle "
              alt="Album"
            />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default DashCourses;
