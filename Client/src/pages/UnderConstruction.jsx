import { Link } from "react-router-dom";
import img from "../assets/images/Under_Construction.svg";

const UnderConstruction = () => {
  return (
    
    <div className="flex justify-center items-center min-h-[50vh] ">
      <div className="flex flex-col justify-center items-center">
        <img
          src={img}
          alt="Under Construction"
          className="w-[90vw] max-w-[600px] max-h-[50vh] block mb-[2rem]"
        />
        <h3 className="mb-[0.5rem]">🚧 Ohh! Page Under Construction 🚧</h3>
        <p className="leading-[1.5rem] mt-[0.5rem] mb-[1rem] text-gray-500">
          We are currently working hard to bring you an awesome new experience.
          Please check back soon!
        </p>
        <Link className="capitalize" to="/">
          <button className="btn btn-neutral">Back Home</button>
        </Link>
      </div>
    </div>
  );
};

export default UnderConstruction;
