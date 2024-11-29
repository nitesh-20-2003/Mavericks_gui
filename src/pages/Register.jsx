import { Form, redirect, Link } from "react-router-dom";
import Wrapper from "../assets/Wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../Components";

import { toast } from "react-toastify";
const Register = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4 style={{"margin-top":"-3rem"}}>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow type="text" name="lastName" labelText="last name" />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn />
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Register;
