import React from "react";
import image from "../assets/images/angry.jpg";
import Laugh from "../assets/images/Laugh.jpg";
import Sad from "../assets/images/sad.jpg";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { IoBook } from "react-icons/io5";
import { MdArrowRightAlt } from "react-icons/md";
const DashDictionary = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await customFetch.get("/char/Allcharacters");
          setData(response.data.data);
          console.log(response);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }
  return (
    <div className=" mt-[10rem] w-[90vw] max-w-[1120px] mx-auto">
      <heading className="flex text-center justify-between mb-[0.8rem]">
        <div className="flex text-center justify-start">
          {/* dataset */}
          <span className="grid place-items-center mr-[0.2rem]">
            {/* Increase the icon size using text-[size] */}
            <IoBook className="text-[0.8rem] md:text-[1.8rem]" />
          </span>
          <div className="flex justify-center items-center">
            <h4 className="font-[500] font-mono ">Our Dictionary</h4>
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
      <div className="w-[90vw] max-w-[1120px] mx-auto mt-[-3rem]">
        <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.slice(6,9).map((product) => {
            const { name, image, _id } = product;
            return (
              <Link
                key={_id}
                to={`/products/${_id}`}
                className="card w-full shadow-xl hover:shadow-2xl transition duration-300 m-2"
              >
                <figure className="px-4 pt-4">
                  <img
                    src={image}
                    alt={name}
                    className="rounded-xl h-64 md:h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title capitalize tracking-wider text-emerald-950">
                    Sign Representing :
                  </h2>
                  <span className="text-blue-400">{name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashDictionary;
