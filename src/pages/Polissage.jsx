import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Polissage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user.role == "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const priceList = {
    citadine: 120,
    berline: 150,
    commercial: 150,
    pickup: 170,
  };

  const [formData, setFormData] = useState({
    date: "",
    hour: "",
    price: "", // This will be dynamically calculated
    type: "complete", // Default to "complete"
    voiture: {
      name: "",
      model: "",
      year: "",
      matricule: "",
      taille: "", // This will determine the base price
    },
    nbPieces: "", // Updated to match the backend schema
  });

  const [availableHours, setAvailableHours] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (formData.date) {
      axios
        .post("http://localhost:3000/polissage/by-date", {
          date: formData.date,
        })
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

  const calculatePrice = () => {
    if (formData.type === "complete" && formData.voiture.taille) {
      return priceList[formData.voiture.taille] || "";
    }

    if (formData.type === "nb_pieces" && formData.nbPieces) {
      return formData.nbPieces * 12;
    }

    return "";
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email) {
      navigate("/signin");
      return;
    }

    const payload = {
      ...formData,
      price: calculatePrice(),
      user: {
        email: user.email,
      },
    };

    try {
      await axios.post("http://localhost:3000/polissage", payload);
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
          Service de Polissage
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

            {/* Type de Polissage */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-300">
                Type de Polissage
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                required
              >
                <option value="complete">Complet</option>
                <option value="nb_pieces">Par Pièce</option>
              </select>
            </div>
          </div>

          {formData.type === "nb_pieces" && (
            <div className="mb-4">
              <label htmlFor="nbPieces" className="block text-gray-300">
                Nombre de Pièces
              </label>
              <input
                type="number"
                id="nbPieces"
                name="nbPieces"
                value={formData.nbPieces}
                onChange={handleChange}
                className="w-full p-2 border border-gray-700 rounded-md mt-2 bg-gray-700 text-white"
                placeholder="Entrez le nombre de pièces"
                required
              />
            </div>
          )}

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

          <div className="text-center mb-4">
            <label className="block text-gray-300">Prix</label>
            <p className="text-gray-200 font-semibold">
              {calculatePrice() ? `${calculatePrice()} TND` : "0 TND"}
            </p>
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

export default Polissage;
