import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCar,
  FaMotorcycle,
  FaShower,
  FaWrench,
  FaGem,
  FaPaintBrush,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState("lavage");

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role == "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user.email) {
      navigate("/signin");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const endpoints = [
          {
            type: "lavage",
            url: `http://localhost:3000/lavages/user/${user.email}`,
          },
          {
            type: "tolerie",
            url: `http://localhost:3000/tolerie/user/${user.email}`,
          },
          {
            type: "polissage",
            url: `http://localhost:3000/polissage/user/${user.email}`,
          },
          {
            type: "detailing",
            url: `http://localhost:3000/detailing/user/${user.email}`,
          },
        ];

        const responses = await Promise.all(
          endpoints.map(({ type, url }) =>
            axios
              .get(url)
              .then((res) =>
                res.data.map((item) => ({ ...item, category: type }))
              )
          )
        );

        setReservations(responses.flat());
      } catch (err) {
        console.error(err);
        setError("Unable to fetch reservations.");
      } finally {
        setLoading(false);
      }
    };

    if (user.email) {
      fetchReservations();
    }
  }, [user.email]);

  const handleDelete = async (id, category) => {
    try {
      const endpoint = `http://localhost:3000/${
        category === "lavage" ? "lavages" : category
      }/${id}`;
      await axios.delete(endpoint);
      setReservations((prev) => prev.filter((res) => res._id !== id));
    } catch (err) {
      console.error(err);
      setError("Unable to cancel the reservation.");
    }
  };

  const filteredReservations = reservations.filter(
    (reservation) => reservation.category === activeType
  );

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <section className="py-16 px-4 bg-gray-900 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Vos Réservations
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { label: "Lavage", icon: FaShower, type: "lavage" },
              { label: "Tôlerie", icon: FaWrench, type: "tolerie" },
              { label: "Polissage", icon: FaGem, type: "polissage" },
              { label: "Detailing", icon: FaPaintBrush, type: "detailing" },
            ].map(({ label, icon: Icon, type }) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                  activeType === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                <Icon size={24} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Chargement...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredReservations.length === 0 ? (
            <p className="text-gray-400 text-center">
              Vous n&apos;avez aucune réservation. Réservez dès maintenant !
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col"
                >
                  <div className="text-center mb-4">
                    <div className="text-5xl text-white mb-4">
                      {reservation.category === "lavage" ? (
                        reservation.type === "voiture" ? (
                          <FaCar />
                        ) : (
                          <FaMotorcycle />
                        )
                      ) : reservation.category === "tolerie" ? (
                        <FaCar />
                      ) : reservation.category === "detailing" ? (
                        <FaPaintBrush />
                      ) : (
                        <FaGem />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {reservation.voiture?.name ||
                        reservation.moto?.name ||
                        "Réservation"}
                    </h3>
                  </div>

                  {reservation.voiture && (
                    <>
                      <p className="text-gray-400 mb-2">
                        Modèle: {reservation.voiture.model}
                      </p>
                      <p className="text-gray-400 mb-2">
                        Année: {reservation.voiture.year}
                      </p>
                      <p className="text-gray-400 mb-2">
                        Taille: {reservation.voiture.taille}
                      </p>
                    </>
                  )}

                  {reservation.moto && (
                    <>
                      <p className="text-gray-400 mb-2">
                        Nom: {reservation.moto.name}
                      </p>
                      <p className="text-gray-400 mb-2">
                        Taille: {reservation.moto.taille}
                      </p>
                    </>
                  )}

                  {reservation.category === "lavage" && (
                    <p className="text-gray-400 mb-2">
                      Type Lavage: {reservation.lavageType}
                    </p>
                  )}

                  {reservation.category === "polissage" && (
                    <p className="text-gray-400 mb-2">
                      Type Polissage: {reservation.type}
                    </p>
                  )}

                  {reservation.category === "detailing" && (
                    <p className="text-gray-400 mb-2">
                      Type Detailing: {reservation.type}
                    </p>
                  )}

                  {reservation.nbPieces && (
                    <p className="text-gray-400 mb-2">
                      Nombre de Pièces: {reservation.nbPieces}
                    </p>
                  )}

                  {reservation.category === "tolerie" && (
                    <p className="text-gray-400 mb-2">
                      Couleur: {reservation.color}
                    </p>
                  )}

                  <p className="text-gray-400 mb-2">Date: {reservation.date}</p>
                  <p className="text-gray-400 mb-2">
                    Heure: {reservation.hour}
                  </p>
                  <p className="text-gray-400 mb-2">
                    Prix:{" "}
                    {reservation.price
                      ? `${reservation.price} TND`
                      : "Calculé sur place"}
                  </p>

                  <button
                    onClick={() =>
                      handleDelete(reservation._id, reservation.category)
                    }
                    className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 text-sm"
                  >
                    Annuler
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reservation;
