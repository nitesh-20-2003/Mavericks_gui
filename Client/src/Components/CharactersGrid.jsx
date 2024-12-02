import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import img from "../../../oneto9/4.jpeg";
import customFetch from "../utils/customFetch";

const CharactersGrid = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get("/char/Allcharacters");
        setData(response.data);
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
    <div className="w-[90vw] max-w-[1120px] mx-auto">
      <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((product) => {
          const { name, image, _id } = product;
          return (
            <Link
              key={_id}
              to={`/products/${_id}`}
              className="card w-full shadow-xl hover:shadow-2xl transition duration-300 m-2"
            >
              <figure className="px-4 pt-4">
                <img
                  src={img}
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
  );
};

export default CharactersGrid;
