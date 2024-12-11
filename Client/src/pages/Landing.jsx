
import { Link } from "react-router-dom";
import {Logo } from "../Components";
import React from 'react'
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
            Mavericks is an innovative crowdsourced platform designed to bridge
            the communication gap between the hearing and non-hearing
            communities by promoting the usage and learning of Indian Sign
            Language (ISL). The platform allows users to actively contribute,
            learn, and interact with a wide variety of ISL content, creating an
            engaging and supportive community that fosters accessibility,
            inclusivity, and empowerment.
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