import { Link, useRouteError } from "react-router-dom";
import img from "../assets/images/Under_Construction.svg";

const UnderConstruction = () => {
  return (
    <div className="min-h-[100vh]  text-center flex  justify-center items-center flex-col">
      <img
        src={img}
        alt=""
        className="w-[90vw] max-w-[600px] block mb-[2rem] mt-[-3rem]"
      />
      <h3 className="mb-[0.5rem] capitalize">Ohh!  page Under construction</h3>
      <Link className="capitalize" to="/">
        <button className="btn btn-primary">Back Home</button>
      </Link>
    </div>
  );
};
export default UnderConstruction;
