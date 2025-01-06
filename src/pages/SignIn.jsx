import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice"; // import the setUser action
import { useSelector } from "react-redux";
import backend from "../../env";
import { Link } from "react-router-dom";
const SignIn = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === "admin") {
      navigate("/dashboard");
    }
    if (user.email !== "") {
      navigate("/");
    }
  }, [user, navigate]);

  const dispatch = useDispatch(); // Get the dispatch function
  const [formData, setFormData] = useState({
    email: "",
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
      // Make POST request to login
      const response = await axios.post(`${backend}/users/login`, formData);

      // Dispatch the user data to Redux
      dispatch(setUser(response.data.user));

      // Navigate based on the user role
      if (response.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur du serveur");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mx-5">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Se connecter
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-400">
              Email
            </label>
            <input
              placeholder="Entrer votre e-mail"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-400">
              Mot de passe
            </label>
            <input
              placeholder="Entrer votre mot de passe"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Se connecter
          </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
