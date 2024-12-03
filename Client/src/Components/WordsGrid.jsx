import { Link, useLoaderData } from "react-router-dom";
import { useState,useEffect } from "react";
import customFetch from "../utils/customFetch";
const WordsGrid = () => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await customFetch.get("/char/Allcharacters");
         setData(response.data.data);
         console.log(response.data.data);
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
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-[90vw] max-w-[1120px] mx-auto">
      {data.map((product) => {
        const { name, image } = product;

        const id = product._id;
        return (
          <Link
            key={id}
            to={`/products/${id}`}
            className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure className="px-4 pt-4">
              <img
                src={image}
                alt={name}
                className="rounded-xl h-64 md:h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title capitalize tracking-wider">
                Sign Representing
              </h2>
              <span className="text-secondary">{name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default WordsGrid;
