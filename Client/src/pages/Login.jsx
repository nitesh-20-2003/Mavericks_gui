import { Link, Form, redirect, useNavigate } from "react-router-dom";
import Wrapper from "../assets/Wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../Components";
import { toast } from "react-toastify";


const Login = () => {
  

  const loginDemoUser = async () => {
    toast.success(`Hor bai kidan !!`)
    const data = {
      email: "test@test.com",
      password: "secret123",
    };
  };
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4 style={{ "margin-top": "-3rem" }}>login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn />
        <div className="flex text-center justify-center">
          <button
            type="button"
            className="btn btn-outline btn-secondary w-[100%]"
            onClick={loginDemoUser}
          >
            explore the app
          </button>
        </div>

        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
