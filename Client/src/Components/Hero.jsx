import { Link } from 'react-router-dom';
import hero2 from '../assets/images/5.jpeg';
import hero1 from "../assets/images/6.jpeg";
import hero3 from "../assets/images/f.jpeg";
import hero4 from "../assets/images/g.jpeg";
const carouselImages = [hero1, hero2, hero3, hero4];

const Hero = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-24 items-center w-[90vw] max-w-[1120px] mx-auto ">
      <div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl text-secondary">
          Dictionary <span className="text-neutral mx-2">Of</span> ISL
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8">
          Welcome to our Dictionary page, where we provide a rich collection of
          word definitions, meanings, and linguistic insights to enhance your
          vocabulary and understanding. Whether you're a student, a writer, or
          just someone with a love for words, our dictionary is your go-to
          resource for exploring the beauty and depth of language.
          <span>
            <a href="" className="link link-neutral ml-3">
              Learn more
            </a>
          </span>
        </p>
        <div className="mt-10 capitalize ">
          <Link
            to="/dashboard/dictionary/Characters"
            className="btn btn-outline btn-secondary "
          >
            characters
          </Link>
          <Link
            to="/dashboard/dictionary/Words"
            className="btn btn-outline btn-secondary ml-6 "
          >
            words
          </Link>
          <Link
            to="/dashboard/dictionary/Nmf"
            className="btn btn-outline btn-secondary ml-6 "
          >
            Non-manual
          </Link>
        </div>
      </div>
      <div className="hidden h-[28rem] lg:carousel carousel-center p-4 space-x-4 bg-neutral rounded-box ">
        {carouselImages.map((image) => {
          return (
            <div key={image} className="carousel-item">
              <img
                src={image}
                className="rounded-box h-full w-80 object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Hero;