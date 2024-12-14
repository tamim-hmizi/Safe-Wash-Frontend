import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role == "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const services = [
    { name: "Polissage", image: "/polissage.jpg", path: "/services/polissage" },
    { name: "Détailage", image: "/detailing.jpg", path: "/services/detailing" },
    { name: "Lavage", image: "/lavage.jpg", path: "/services/lavage" },
    { name: "Tôlerie", image: "/tolerie.jpg", path: "/services/tolerie" },
  ];

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
            SAFE WASH
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto">
            Votre partenaire pour un lavage automobile impeccable et de qualité.
          </p>
        </div>
      </section>

      <section className="py-16 px-16 ">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="relative overflow-hidden cursor-pointer rounded-lg shadow-lg bg-gray-800"
                onClick={() => (window.location.href = service.path)}
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-80 flex items-center justify-center">
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {service.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:items-center md:justify-center">
          <div className="md:order-2 flex-shrink-0 mb-8 md:mb-0 md:ml-8 w-full md:w-1/2">
            <img
              src="/content1.jpg"
              alt="About Us"
              className="h-96 sm:h-96 lg:h-[700px] rounded-lg shadow-lg mx-auto"
            />
          </div>
          <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0 md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos Services de Lavage
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Chez SAFE WASH, nous offrons une gamme de services de lavage
              automobile qui répondent à tous vos besoins. Faites confiance à
              nos experts pour un nettoyage de qualité supérieure.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4  text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Contactez-Nous
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            Pour toute question ou demande de service, n’hésitez pas à nous
            contacter. Nous sommes là pour vous aider.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            En savoir plus
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
