import { div } from "framer-motion/client";
import { useNavigation } from "react-router-dom";
const SubmitBtn = ({ formBtn }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className="flex  text-center justify-center">
      <button
        type="submit"
        className={`btn btn-outline btn-secondary w-[100%] ${
          formBtn && "form-btn"
        } `}
        disabled={isSubmitting}
      >
        {isSubmitting ? "submitting" : "submit"}
      </button>
    </div>
  );
};
export default SubmitBtn;
