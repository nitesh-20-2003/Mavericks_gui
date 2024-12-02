import React, { useState } from "react";
import User from "../assets/images/User.svg"

const Logout = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative inline-block text-center">
      {/* Avatar Button */}
      <div onClick={toggleDropdown} className="cursor-pointer avatar">
        <div className="ring-neutral ring-offset-base-50 rounded-full ring ring-offset-[0.01rem] h-[50px] w-[50px]">
          <img
            src={User}
            alt="Avatar"
          />
        </div>
      </div>

      {dropdownOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-auto  rounded-lg z-50">
          <ul className="py-1">
            <li>
              <button
                onClick={() => console.log("Logout clicked")}
                className="btn btn-outline w-[100px] h-[40]"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Logout;
