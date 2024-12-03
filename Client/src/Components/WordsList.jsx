import { Link, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import customFetch from "../utils/customFetch";


const ProductsList = () => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await customFetch.get("/char/Allcharacters");
         setData(response.data.data);
         console.log(response.data);
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
    <div className="mt-12 grid gap-y-8 w-[90vw] max-w-[1120px] mx-auto">
      {data.map((product) => {
        const { name, image } = product;
        const id = product._id;
        return (
          <Link
            key={id}
            to={`/products/${product.id}`}
            className="p-8 rounded-lg flex flex-col sm:flex-row gap-y-4 flex-wrap  bg-base-100 shadow-xl hover:shadow-2xl duration-300 group"
          >
            <img
              src={image}
              alt={name}
              className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="ml-0 sm:ml-16">
              <h3 className="capitalize font-medium text-lg">
                Sign Representing :
              </h3>
            </div>
            <p className="font-medium ml-0 sm:ml-auto text-lg">{name}</p>
          </Link>
        );
      })}
    </div>
  );
};
export default ProductsList;
