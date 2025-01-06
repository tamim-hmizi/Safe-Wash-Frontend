import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Contact = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role == "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const slideshowImages = [
    "/slideshow1.jpg",
    "/slideshow2.jpg",
    "/slideshow3.jpg",
    "/slideshow4.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <section className="relative overflow-hidden text-center h-[500px] md:h-[700px] flex items-center justify-center">
        <img
          src={slideshowImages[currentSlide]}
          alt="Slideshow"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-10 px-4 bg-black bg-opacity-50 py-10 rounded-md">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold">
            Contactez-Nous
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto">
            Restons en contact pour toute question ou assistance.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-800 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Nos Coordonnées
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            Retrouvez-nous sur les réseaux sociaux ou envoyez-nous un e-mail
            directement.
          </p>

          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://www.instagram.com/safewash.tn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-pink-500 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.33 3.608 1.305.976.976 1.244 2.243 1.305 3.608.059 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.33 2.633-1.305 3.608-.976.976-2.243 1.244-3.608 1.305-1.266.059-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.33-3.608-1.305-.976-.976-1.244-2.243-1.305-3.608-.059-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.33-2.633 1.305-3.608C5.517 2.493 6.784 2.225 8.15 2.163 9.416 2.104 9.796 2.092 12 2.092zm0-2.163C8.735 0 8.332.015 7.052.072 5.777.129 4.675.414 3.785 1.303 2.895 2.193 2.61 3.295 2.553 4.57.495 6.85.48 7.253.48 12s.015 5.15.072 6.43c.057 1.275.342 2.377 1.232 3.267.89.89 1.992 1.175 3.267 1.232 1.28.057 1.683.072 6.43.072s5.15-.015 6.43-.072c1.275-.057 2.377-.342 3.267-1.232.89-.89 1.175-1.992 1.232-3.267.057-1.28.072-1.683.072-6.43s-.015-5.15-.072-6.43c-.057-1.275-.342-2.377-1.232-3.267-.89-.89-1.992-1.175-3.267-1.232C16.35.015 15.947 0 12 0z" />
                <circle cx="12" cy="12" r="3.486" />
                <path d="M18.406 4.594a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
              </svg>
            </a>
            <a
              href="mailto:safewashsupport@gmail.com"
              className="text-gray-300 hover:text-green-500 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12.713l-11.99-9.713v16.287h24v-16.287l-12.01 9.713zm0-1.415l12-9.713h-24l12 9.713z" />
              </svg>
            </a>
            <a
              href="tel:+21693883533"
              className="text-gray-300 hover:text-green-500 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.487 15.14c-1.047-.52-2.125-.918-3.207-1.188-.693-.17-1.42-.016-1.937.504l-2.019 2.017c-2.98-1.554-5.478-4.05-7.032-7.029l2.017-2.019c.52-.517.674-1.243.504-1.937-.27-1.081-.667-2.159-1.188-3.207-.607-1.22-2.086-1.618-3.18-.963l-2.304 1.378c-.796.476-1.278 1.349-1.278 2.286 0 7.258 5.908 13.166 13.166 13.166.937 0 1.81-.482 2.286-1.278l1.378-2.304c.654-1.094.257-2.573-.963-3.18z" />
              </svg>
            </a>
          </div>

          <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.fr/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509476!2d144.95592831564536!3d-37.81720974201457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577df8dc1d8f01a!2sVictoria%20Harbour!5e0!3m2!1sen!2sau!4v1602141435937!5m2!1sen!2sau"
              width="100%"
              height="100%"
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              className="border-0 filter grayscale-[30%] invert-[90%]"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
