import React from 'react'
import image from '../assets/images/angry.jpg'
import Laugh from '../assets/images/Laugh.jpg'
import Sad from '../assets/images/sad.jpg'
import { Link } from 'react-router-dom'
// icons
import { MdDatasetLinked } from "react-icons/md";
import { MdArrowRightAlt } from "react-icons/md";
const DashDatasets = () => {
  return (
    <div className=" mt-[10rem] w-[90vw] max-w-[1120px] mx-auto">
      <heading className="flex text-center justify-between mb-[0.8rem]">
        <div className="flex text-center justify-start">
          {/* dataset */}
          <span className="grid place-items-center mr-[0.2rem]">
            {/* Increase the icon size using text-[size] */}
            <MdDatasetLinked className="text-[0.8rem] md:text-[1.8rem]" />
          </span>
          <div className="flex justify-center items-center">
            <h4 className="font-[500] font-mono "> Datasets</h4>
          </div>
        </div>
        {/* viewall */}
        <Link className="btn" to="/Dashboard/Datasets">
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
            <h2 className="card-title">Angry</h2>
            <div className="text-[0.8em]">
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla
                corrupti recusandae quisquam illo maiores. Obcaecati ea odit
                nulla eos ut?
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
            <h2 className="card-title">Laugh</h2>
            <div className="text-[0.8em]">
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla
                corrupti recusandae quisquam illo maiores. Obcaecati ea odit
                nulla eos ut?
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
            <h2 className="card-title">Sad</h2>
            <div className="text-[0.8em]">
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla
                corrupti recusandae quisquam illo maiores. Obcaecati ea odit
                nulla eos ut?
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
}

export default DashDatasets