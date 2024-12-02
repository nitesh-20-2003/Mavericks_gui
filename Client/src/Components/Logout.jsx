import React, { useState } from "react";

const Logout = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative inline-block text-center">
      {/* Avatar Button */}
      <div onClick={toggleDropdown} className="cursor-pointer avatar">
        <div className="ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2 h-[50px] w-[50px]">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
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
