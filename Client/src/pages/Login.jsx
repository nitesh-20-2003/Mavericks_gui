import { Link, Form, redirect, useNavigate } from "react-router-dom";
import Wrapper from "../assets/Wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../Components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    // Send login request to the backend
    const response = await customFetch.post("/auth/login", data);
    // Save token to localStorage
    localStorage.setItem("token", response.data.token);  // Assuming token is returned in response
    toast.success("Login successful");
    return redirect("/dashboard");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  const navigate = useNavigate();

  const loginDemoUser = async () => {
    const data = {
      email: "test@test.com",
      password: "secret123",
    };
    try {
      const response = await customFetch.post("/auth/login", data);
      // Save token to localStorage
      localStorage.setItem("token", response.data.token);  // Assuming token is returned in response
      toast.success("Take a test drive");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn />
        
        <div className="flex justify-center text-center"></div>
        
        {/* Demo login button */}
        <button
          type="button"
          className="btn btn-outline btn-secondary w-[100%]"
          onClick={loginDemoUser}
        >
          Explore the app
        </button>

        {/* Register link */}
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
