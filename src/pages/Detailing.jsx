import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Access Redux state
import backend from "../../env";
const Detailing = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Access user from Redux

  useEffect(() => {
    if (user.role == "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    date: "",
    hour: "", // No longer need "type" field
    voiture: {
      name: "",
      model: "",
      year: "",
      matricule: "",
      taille: "citadine", // Default taille for voiture
    },
    price: 0,
  });

  const [availableHours, setAvailableHours] = useState([]);
  const [error, setError] = useState("");

  // Pricing logic (simple example, modify as needed)
  const calculatePrice = useCallback(() => {
    const voiturePrices = {
      citadine: 100,
      berline: 120,
      commercial: 120,
      pickup: 130,
    };

    return voiturePrices[formData.voiture.taille] || 50;
  }, [formData.voiture.taille]);

  // Update price whenever relevant fields change
  useEffect(() => {
    setFormData((prevState) => ({ ...prevState, price: calculatePrice() }));
  }, [calculatePrice]); // Only depend on calculatePrice

  // Fetch unavailable hours when the date changes
  useEffect(() => {
    if (formData.date) {
      axios
        .post(`${backend}/detailing/by-date`, {
          date: formData.date,
        })
        .then((response) => {
          const bookedHours = response.data.map((detailing) => detailing.hour);
          generateAvailableHours(bookedHours);
        })
        .catch((err) => {
          console.error(err);
          setError("Erreur lors du chargement des heures disponibles.");
        });
    }
  }, [formData.date]);

  const generateAvailableHours = (bookedHours) => {
    const hours = ["8:00", "14:30"];

    // Filter out booked hours
    setAvailableHours(
      hours.map((hour) => ({
        time: hour,
        booked: bookedHours.includes(hour),
      }))
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("voiture.")) {
      const [object, field] = name.split(".");
      setFormData({
        ...formData,
        [object]: {
          ...formData[object],
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email) {
      navigate("/signin");
      return;
    }

    const payload = {
      date: formData.date,
      hour: formData.hour,
      price: formData.price,
      user: { email: user.email },
      voiture: formData.voiture,
    };

    try {
      await axios.post(backend + "/detailing", payload);
      navigate("/mes-reservation/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la réservation.");
    }
  };

  return (
    <div className="flex justify-center items-center my-10 mx-5">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-center text-2xl font-semibold mb-6 text-white">
          Service de Détailage
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-300">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              />
            </div>

            {/* Hour */}
            <div className="mb-4">
              <label htmlFor="hour" className="block text-gray-300">
                Heure
              </label>
              <select
                id="hour"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              >
                <option value="">Sélectionnez une heure</option>
                {availableHours.map((slot) => (
                  <option
                    key={slot.time}
                    value={slot.time}
                    disabled={slot.booked}
                  >
                    {slot.time} {slot.booked ? "(Réservé)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voiture details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="voiture.name" className="block text-gray-300">
                Nom de la voiture
              </label>
              <input
                type="text"
                id="voiture.name"
                name="voiture.name"
                value={formData.voiture.name}
                placeholder="Entrez le nom"
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="voiture.model" className="block text-gray-300">
                Modèle de la voiture
              </label>
              <input
                type="text"
                id="voiture.model"
                name="voiture.model"
                value={formData.voiture.model}
                placeholder="Entrez le modèle"
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="voiture.year" className="block text-gray-300">
                Année de la voiture
              </label>
              <input
                type="text"
                id="voiture.year"
                name="voiture.year"
                value={formData.voiture.year}
                placeholder="Entrez l'année"
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="voiture.matricule"
                className="block text-gray-300"
              >
                Matricule de la voiture
              </label>
              <input
                type="text"
                id="voiture.matricule"
                name="voiture.matricule"
                value={formData.voiture.matricule}
                placeholder="Entrez le matricule"
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="voiture.taille" className="block text-gray-300">
                Taille de la voiture
              </label>
              <select
                id="voiture.taille"
                name="voiture.taille"
                value={formData.voiture.taille}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              >
                <option value="citadine">Citadine</option>
                <option value="berline">Berline</option>
                <option value="commercial">Commercial</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
          </div>

          {/* Display the price */}
          <div className="text-center mb-4">
            <label className="block text-gray-300">Prix</label>
            <p className="text-gray-200 font-semibold">{formData.price} TND</p>
          </div>

          {/* Submit button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-500"
            >
              Réserver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Detailing;
