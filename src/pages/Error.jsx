import { Link, useRouteError } from "react-router-dom";
import img from '../assets/images/Not_found.svg'
const Error = () => {
  const error =useRouteError();
  console.log(error);
  if(error.status==404)
  {
    return (
      <div className="min-h-[100vh]  text-center flex  justify-center items-center flex-col">
        <img
          src={img}
          alt="not found"
          className="w-[90vw] max-w-[600px] block mb-[2rem] mt-[-3rem]"
        />
        <h3 className="mb-[0.5rem]">Ohh! page not found</h3>
        <p className=" leading-[1.5rem] mt-[0.5rem] mb-[1rem] text-gray-500">
          we can't seem to find the page you are looking for
        </p>
        <Link className="capitalize " to="/">
          <button className="btn btn-neutral">Back Home</button>
        </Link>
      </div>
    );
  }
 
};
export default Error;
