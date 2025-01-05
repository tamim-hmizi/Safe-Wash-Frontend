import { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import backend from "../../env";
const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend}/commandes/${user.email}`);
        if (Array.isArray(response.data)) {
          setCommandes(response.data);
        } else {
          console.error("Format de réponse inattendu :", response.data);
          setCommandes([]);
        }
      } catch (err) {
        console.error(err);
        setError("Échec de la récupération des commandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [user.email]);

  const cancelCommande = async (commandeId) => {
    try {
      await axios.delete(`${backend}/commandes/${commandeId}`);
      setCommandes((prevCommandes) =>
        prevCommandes.filter((commande) => commande._id !== commandeId)
      );
    } catch (err) {
      console.error("Échec de l'annulation de la commande :", err);
      setError("Échec de l'annulation de la commande.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Commandes Section */}
      <section className="py-16 px-4 bg-gray-900 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Vos Commandes
          </h2>

          {loading ? (
            <p className="text-center text-gray-400">Chargement...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : commandes.length === 0 ? (
            <p className="text-gray-400 text-center">
              Vous n&apos;avez aucune commande. Commencez vos achats dès
              maintenant !
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {commandes.map((commande) => (
                <div
                  key={commande._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col"
                >
                  <img
                    src={commande.product.image}
                    alt={commande.product.name || "Produit"}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {commande.product?.name || "Produit inconnu"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {commande.product?.description ||
                      "Description non disponible."}
                  </p>
                  <p className="text-gray-200 font-bold mb-4">
                    {commande.product?.price
                      ? `${commande.product?.price} €`
                      : "N/A"}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span
                      className={`flex items-center gap-2 text-sm font-medium ${
                        commande.verified ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {commande.verified ? (
                        <>
                          <FiCheckCircle size={18} /> Vérifiée
                        </>
                      ) : (
                        <>
                          <FiXCircle size={18} /> En attente
                        </>
                      )}
                    </span>
                    {!commande.verified && (
                      <button
                        onClick={() => cancelCommande(commande._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 text-sm"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Commandes;
