import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-100">About ISL-NMF</h3>
            <p className="text-gray-300 leading-relaxed">
              ISL-NMF aims to bridge communication gaps by leveraging advanced AI to translate Indian Sign Language (ISL) gestures into text or speech. Together, we make communication accessible and inclusive.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/features" className="text-gray-300 hover:text-blue-200 hover:underline transition duration-300">
                  Features
                </a>
              </li>
              <li>
                <a href="/future-scope" className="text-gray-300 hover:text-blue-200 hover:underline transition duration-300">
                  Future Scope
                </a>
              </li>
              <li>
                <a href="/contribute" className="text-gray-300 hover:text-blue-200 hover:underline transition duration-300">
                  Contribute
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-blue-200 hover:underline transition duration-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-100">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: <a href="mailto:support@isl-nmf.com" className="text-gray-300 hover:text-blue-200 hover:underline transition duration-300">support@isl-nmf.com</a></li>
              <li>Phone: <a href="tel:+1234567890" className="text-gray-300 hover:text-blue-200 hover:underline transition duration-300">+1 234 567 890</a></li>
              <li>Address: 123 Innovation Lane, Tech City</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-500 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} ISL-NMF. All rights reserved.
          </p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-200 transition duration-300"
            >
              <img
                src="https://via.placeholder.com/24x24"
                alt="Facebook"
                className="w-6 h-6 transform hover:scale-110 transition duration-300"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-200 transition duration-300"
            >
              <img
                src="https://via.placeholder.com/24x24"
                alt="Twitter"
                className="w-6 h-6 transform hover:scale-110 transition duration-300"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-200 transition duration-300"
            >
              <img
                src="https://via.placeholder.com/24x24"
                alt="LinkedIn"
                className="w-6 h-6 transform hover:scale-110 transition duration-300"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
