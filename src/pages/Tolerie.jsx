import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TolerieForm = () => {
  const navigate = useNavigate();
  // Access the current user from Redux state
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user.role == "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    date: "",
    hour: "",
    color: "",
    voiture: {
      name: "",
      model: "",
      year: "",
      matricule: "",
      taille: "",
    },
  });

  const [availableHours, setAvailableHours] = useState([]);
  const [error, setError] = useState("");

  // Fetch unavailable hours when the date changes
  useEffect(() => {
    if (formData.date) {
      axios
        .post("http://localhost:3000/tolerie/by-date", { date: formData.date })
        .then((response) => {
          const bookedHours = response.data.map((booking) => booking.hour);
          generateAvailableHours(bookedHours);
        })
        .catch((err) => {
          console.error(err);
          setError("Erreur lors du chargement des heures disponibles.");
        });
    }
  }, [formData.date]);

  // Generate 1-hour interval time slots
  const generateAvailableHours = (bookedHours) => {
    const startHour = 8;
    const endHour = 21;
    const intervals = [];

    for (let hour = startHour; hour < endHour; hour++) {
      intervals.push(`${hour}:00`);
    }

    setAvailableHours(
      intervals.map((slot) => ({
        time: slot,
        booked: bookedHours.includes(slot),
      }))
    );
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("voiture.")) {
      const [, field] = name.split(".");
      setFormData({
        ...formData,
        voiture: {
          ...formData.voiture,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email) {
      navigate("/signin");
      return;
    }

    const payload = {
      ...formData,
      user: {
        email: user.email,
      },
    };

    try {
      await axios.post("http://localhost:3000/tolerie", payload);
      navigate("/mes-reservation/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de la réservation.");
    }
  };

  return (
    <div className="flex justify-center items-center my-10 mx-5">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-center text-2xl font-semibold mb-6 text-white">
          Service de Tôlerie
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

            {/* Color */}
            <div className="mb-4">
              <label htmlFor="color" className="block text-gray-300">
                Couleur
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                placeholder="Entrez une couleur"
                required
              />
            </div>
          </div>

          {/* Voiture details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="voiture.name" className="block text-gray-300">
                Nom de la Voiture
              </label>
              <input
                type="text"
                id="voiture.name"
                name="voiture.name"
                value={formData.voiture.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                placeholder="Entrez le nom"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="voiture.model" className="block text-gray-300">
                Modèle
              </label>
              <input
                type="text"
                id="voiture.model"
                name="voiture.model"
                value={formData.voiture.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                placeholder="Entrez le modèle"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="voiture.year" className="block text-gray-300">
                Année
              </label>
              <input
                type="text"
                id="voiture.year"
                name="voiture.year"
                value={formData.voiture.year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                placeholder="Entrez l'année"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="voiture.matricule"
                className="block text-gray-300"
              >
                Matricule
              </label>
              <input
                type="text"
                id="voiture.matricule"
                name="voiture.matricule"
                value={formData.voiture.matricule}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                placeholder="Entrez le matricule"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="voiture.taille" className="block text-gray-300">
                Taille
              </label>
              <select
                id="voiture.taille"
                name="voiture.taille"
                value={formData.voiture.taille}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              >
                <option value="">Sélectionnez une taille</option>
                <option value="citadine">Citadine</option>
                <option value="berline">Berline</option>
                <option value="commercial">Commercial</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
          </div>

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

export default TolerieForm;
