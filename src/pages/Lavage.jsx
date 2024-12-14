import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Access Redux state

const Lavage = () => {
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
    type: "voiture", // Default type
    lavageType: "rapide", // Default lavage type
    voiture: {
      name: "",
      model: "",
      year: "",
      matricule: "",
      taille: "citadine", // Default taille for voiture
    },
    moto: {
      name: "",
      taille: "petit", // Default taille for moto
    },
  });

  const [availableHours, setAvailableHours] = useState([]);
  const [error, setError] = useState("");
  const [price, setPrice] = useState(0);

  // Pricing logic
  const calculatePrice = useCallback(() => {
    const voiturePrices = {
      citadine: { rapide: 13, express: 5 },
      berline: { rapide: 15, express: 5 },
      commercial: { rapide: 17, express: 5 },
      pickup: { rapide: 20, express: 5 },
    };

    const motoPrices = {
      grande: { rapide: 10, express: 5 },
      petit: { rapide: 6, express: 5 },
    };

    if (formData.type === "voiture") {
      return voiturePrices[formData.voiture.taille][formData.lavageType];
    } else if (formData.type === "moto") {
      return motoPrices[formData.moto.taille][formData.lavageType];
    }
    return 0;
  }, [formData]);

  // Update price whenever relevant fields change
  useEffect(() => {
    setPrice(calculatePrice()); // Update the price when formData changes
  }, [formData, calculatePrice]);

  // Fetch unavailable hours when the date changes
  useEffect(() => {
    if (formData.date) {
      axios
        .post(`http://localhost:3000/lavages/by-date`, { date: formData.date }) // Ensure backend filters by date
        .then((response) => {
          const bookedHours = response.data.map((lavage) => lavage.hour); // Only hours for the selected date
          generateAvailableHours(bookedHours);
        })
        .catch((err) => {
          console.error(err);
          setError("Erreur lors du chargement des heures disponibles.");
        });
    }
  }, [formData.date]);

  // Generate 30-minute interval time slots and exclude booked slots
  const generateAvailableHours = (bookedHours) => {
    const startHour = 8; // Start of the working day
    const endHour = 21; // End of the working day
    const intervals = [];

    for (let hour = startHour; hour < endHour; hour++) {
      intervals.push(`${hour}:00`, `${hour}:30`);
    }

    // Mark time slots as booked if they are in the list of bookedHours
    setAvailableHours(
      intervals.map((slot) => ({
        time: slot,
        booked: bookedHours.includes(slot), // Check if the slot is booked for the selected date
      }))
    );
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("voiture.") || name.startsWith("moto.")) {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email) {
      navigate("/signin");
      return;
    }

    const payload = {
      date: formData.date,
      hour: formData.hour,
      type: formData.type,
      lavageType: formData.lavageType,
      user: {
        email: user.email,
      },
      ...(formData.type === "voiture" && { voiture: formData.voiture }),
      ...(formData.type === "moto" && { moto: formData.moto }),
    };

    try {
      await axios.post("http://localhost:3000/lavages", payload);
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
          Service de Lavage
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
                <option value="" disabled>
                  Sélectionner une heure
                </option>
                {availableHours.map(({ time, booked }) => (
                  <option key={time} value={time} disabled={booked}>
                    {time} {booked ? "(Réservé)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Type of service */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-300">
                Type de service
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              >
                <option value="voiture">Voiture</option>
                <option value="moto">Moto</option>
              </select>
            </div>

            {/* Lavage type */}
            <div className="mb-4">
              <label htmlFor="lavageType" className="block text-gray-300">
                Type de lavage
              </label>
              <select
                id="lavageType"
                name="lavageType"
                value={formData.lavageType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              >
                <option value="rapide">Rapide</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>

          {/* Voiture details */}
          {formData.type === "voiture" && (
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
                >
                  <option value="citadine">Citadine</option>
                  <option value="berline">Berline</option>
                  <option value="commercial">Commercial</option>
                  <option value="pickup">Pickup</option>
                </select>
              </div>
            </div>
          )}

          {/* Moto details */}
          {formData.type === "moto" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="moto.name" className="block text-gray-300">
                  Nom de la moto
                </label>
                <input
                  type="text"
                  id="moto.name"
                  name="moto.name"
                  value={formData.moto.name}
                  placeholder="Entrez le nom"
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="moto.taille" className="block text-gray-300">
                  Taille de la moto
                </label>
                <select
                  id="moto.taille"
                  name="moto.taille"
                  value={formData.moto.taille}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                >
                  <option value="petit">Petit</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-lg font-semibold text-white my-5">
              Prix: {price} TND
            </p>

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

export default Lavage;
