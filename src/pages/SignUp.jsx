import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import backend from "../../env";

const SignUp = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.role === "admin") {
      navigate("/dashboard");
    }
    if (user.email !== "") {
      navigate("/");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(backend + "/users/register", formData);
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de serveur");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mx-5">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Créer un compte
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-400">
              Prénom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Entrer votre prénom"
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="lastName" className="block text-gray-400">
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Entrer votre nom"
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrer votre e-mail"
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-gray-400">
              Téléphone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Entrer votre numéro de téléphone"
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-400">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Créer un mot de passe"
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            S&apos;inscrire
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          Déjà un compte ?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
