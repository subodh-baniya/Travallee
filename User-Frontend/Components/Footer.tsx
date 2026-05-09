import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-blue-800 via-blue-900 to-indigo-900 text-gray-200 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-start">

        {/* Logo / Brand + CTA */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-2">Travallee</h2>
          <p className="text-gray-300 text-sm">
            Connecting hotels with travelers. Manage your property, grow your business, and reach more guests.
          </p>
        </div>

        {/* Social / Contact */}
        <div className="text-center md:text-right">
          <h3 className="font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-end space-x-4 mb-4">
            
            {/* Facebook Link */}
            <a 
              href="https://www.facebook.com/kcprabin09" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF className="hover:text-blue-500 cursor-pointer transition transform hover:scale-110" />
            </a>

            {/* Instagram Link */}
            <a 
              href="https://www.instagram.com/kc_prabinn/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-pink-500 cursor-pointer transition transform hover:scale-110" />
            </a>

            {/* Twitter Link */}
            <a 
              href="#" /* Replace the # with your actual Twitter link */
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="hover:text-blue-400 cursor-pointer transition transform hover:scale-110" />
            </a>

          </div>
          <p className="text-gray-400 text-sm">
            &copy; 2026 Travallee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;