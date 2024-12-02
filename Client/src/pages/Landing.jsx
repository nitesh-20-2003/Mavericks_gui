
import { Link } from "react-router-dom";
import {Logo } from "../Components";
import React from 'react'
import customFetch from "../utils/customFetch";
import main from '../assets/images/main.svg'
import Wrapper from "../assets/Wrappers/LandingPage";
const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1 className="">
            <span>Croudsource</span> app
          </h1>
          <p>
            I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
            bottle single-origin coffee chia. Aesthetic post-ironic venmo,
            quinoa lo-fi tote bag adaptogen everyday carry meggings +1 brunch
            narwhal.
          </p>
          <Link
            to="/register"
            className="btn btn-outline btn-secondary register-link"
          >
            Register
          </Link>
          <Link to="/login" className="btn btn-outline btn-secondary ">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
}

export default Landing