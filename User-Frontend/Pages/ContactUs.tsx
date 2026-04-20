import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigateto=useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <section className="relative h-[45vh] flex items-center justify-center text-center text-white">
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
          className="absolute inset-0 w-full h-full object-cover"
          alt="contact"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          className="relative px-6 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In Touch With Us
          </h1>
          <p className="text-lg text-gray-200">
            Have questions about listing your hotel or managing bookings on Travallee? Reach out via phone, email, or visit us in Kathmandu.
          </p>
        </motion.div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">

        {[
          {
            icon: <FaPhoneAlt className="text-3xl text-blue-600 mx-auto mb-4" />,
            title: "Phone",
            text: "+977 98XXXXXXXX",
          },
          {
            icon: <FaEnvelope className="text-3xl text-blue-600 mx-auto mb-4" />,
            title: "Email",
            text: "kcprabin2063@gmail.com",
          },
          {
            icon: <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-4" />,
            title: "Location",
            text: "Kathmandu, Nepal",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white p-8 rounded-xl shadow-md text-center transition transform hover:-translate-y-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
            }}
          >
            {item.icon}
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.text}</p>
          </motion.div>
        ))}

      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to List Your Hotel?
          </h2>
          <p className="mb-6 text-lg max-w-xl mx-auto">
            Join Travallee and start connecting your hotel with travelers using our mobile booking platform.
          </p>
          <motion.button
          whileHover={{scale:1.02}}
          whileTap={{scale:0.95}}
          transition={{type:"spring",stiffness:300}}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
          onClick={()=>{navigateto("/register")}}>
            Register Your Hotel
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
};

export default Contact;