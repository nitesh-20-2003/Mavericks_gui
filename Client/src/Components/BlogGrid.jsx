import React from 'react'
import Blog1 from '../assets/images/blog1.jpeg'
import Blog2 from '../assets/images/blog2.jpeg'
import Blog3 from '../assets/images/blog3.jpeg'
import Blog4 from '../assets/images/blog4.jpeg'
import Blog5 from '../assets/images/blog5.jpeg'
import Blog6 from '../assets/images/blog6.jpeg'
import Blog7 from "../assets/images/blog7.jpeg";
import { nanoid } from "nanoid";

const data=[
  Blog1,Blog2,Blog3,Blog4,Blog5,Blog6,Blog7 
]
import { Link } from 'react-router-dom'
const BlogGrid = () => {
  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-[90vw] max-w-[1120px] mx-auto">
      {data.map((image) => {
  

        const id =  nanoid()
        return (
          <Link
            key={id}
            to={`/products/${id}`}
            className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure className="px-4 pt-4">
              <img
                src={image}
                className="rounded-xl h-64 md:h-48 w-full object-cover"
              />
            </figure>

          </Link>
        );
      })}
    </div>
  );
}

export default BlogGrid