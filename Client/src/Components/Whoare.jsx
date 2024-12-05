
import React from 'react'
import image from '../assets/images/Learner.svg'
import Reserch from '../assets/images/Resercher.svg'
import Contributers from '../assets/images/Contributer.svg'
const Whoare = () => {
  return (
    <div className="  w-[90vw] max-w-[1120px] mx-auto border-b border-base-300 pb-[5rem] ">
      <div>
        <h4 className="font-[500] font-mono ">Who's On Mavericks</h4>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <div className="card lg:card-side bg-base-100 shadow-xl h-[10rem] w-[18rem]">
          <div className="card-body">
            <h2 className="card-title">Learners</h2>
            <p>Lorem, ipsum dolor sit amet consectetur </p>
            <div className="card-actions justify-end"></div>
          </div>
          <figure>
            <img
              src={image}
              className="  hidden  md:block md:h-[100px] md:w-[230px] md:mr-[0.2rem] "
              alt="Album"
            />
          </figure>
        </div>
        <div className="card lg:card-side bg-base-100 shadow-xl h-[10rem] w-[18rem]">
          <div className="card-body">
            <h2 className="card-title">Reserchers</h2>
            <p>Lorem, ipsum dolor sit amet consectetur </p>
            <div className="card-actions justify-end"></div>
          </div>
          <figure>
            <img
              src={Reserch}
              className="  hidden md:block md:h-[100px] md:w-[230px] md:mr-[0.2rem] "
              alt="Album"
            />
          </figure>
        </div>
        <div className="card lg:card-side bg-base-100 shadow-xl h-[10rem] w-[18rem]">
          <div className="card-body">
            <h2 className="card-title">Contributors</h2>
            <p>User ,can contribute to NMF dataset </p>
            <div className="card-actions justify-end"></div>
          </div>
          <figure>
            <img
              src={Contributers}
              className="  hidden md:block md:h-[100px] md:w-[230px] md:mr-[0.2rem] "
              alt="Album"
            />
          </figure>
        </div>
      </div>
    </div>
  );
}

export default Whoare