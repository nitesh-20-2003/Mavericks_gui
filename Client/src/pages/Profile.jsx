import React, { useState } from "react";
import User from "../assets/images/User.svg";
import { toast } from "react-toastify";
import Paras from '../assets/images/paras.png'
const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    occupation: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleSubmit = (e) => {
    toast.success(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={Paras}
          alt="Example"
          style={{ width: 50, height: 50, marginRight: 10 }}
        />
        <span className="capitalize font-mono">Hello i am Paras ahuja</span>
      </div>);
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You can add functionality to handle the form submission like API calls
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* The flex container ensures centering horizontally and vertically */}
      <div className="card bg-base-100 w-[600px] shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src={User}
            alt="Profile"
            className="rounded-xl mask mask-squircle w-36"
          />
        </figure>

        <form onSubmit={handleSubmit} className="px-10 py-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-bordered w-full mt-2"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-semibold">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full mt-2"
              placeholder="Write your bio"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input input-bordered w-full mt-2"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="occupation" className="block text-sm font-semibold">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="input input-bordered w-full mt-2"
              placeholder="Enter your occupation"
              required
            />
          </div>

          <div className="mb-4 flex items-center justify-center">
            <div className="">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Max size <span className="font-bold">0.5MB</span></span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                  onChange={handleImageChange}
                  accept="image/*"
                />

              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-outline w-full mt-4" >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
