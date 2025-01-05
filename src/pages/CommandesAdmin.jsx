import { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import backend from "../../env";
const CommandesAdmin = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.email == "") navigate("/signin");
    if (user.role == "user") navigate("/");
  }, [user, navigate]);

  // Fetch all commandes
  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(backend + "/commandes");
        setCommandes(response.data);
      } catch (err) {
        console.error("Error fetching commandes:", err);
        setError("Failed to fetch commandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  // Handle verification toggle
  const toggleVerification = async (commandeId, isVerified) => {
    try {
      await axios.put(backend + "/commandes/verify", {
        commandeId,
        isVerified,
      });
      setCommandes((prev) =>
        prev.map((commande) =>
          commande._id === commandeId
            ? { ...commande, verified: isVerified }
            : commande
        )
      );
    } catch (err) {
      console.error("Error updating verification status:", err);
      setError("Failed to update verification status.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Gestion des Commandes
          </h1>

          {loading ? (
            <p className="text-center text-gray-400">Chargement...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : commandes.length === 0 ? (
            <p className="text-center text-gray-400">
              Aucune commande disponible.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {commandes.map((commande) => (
                <div
                  key={commande._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col"
                >
                  {/* Product Image */}
                  {commande.product?.image ? (
                    <img
                      src={commande.product.image}
                      alt={commande.product.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <span className="text-gray-500">
                        Image non disponible
                      </span>
                    </div>
                  )}

                  {/* Product Name */}
                  <h2 className="text-lg font-semibold text-white mb-2">
                    <strong>Produit :</strong>{" "}
                    {commande.product?.name || "Produit inconnu"}
                  </h2>

                  {/* User Info */}
                  <p className="text-gray-400 mb-2">
                    <strong>Commanditaire :</strong>{" "}
                    {commande.user?.name + " " + commande.user?.lastName ||
                      "Nom inconnu"}
                  </p>
                  <p className="text-gray-400 mb-4">
                    <strong>Numéro :</strong>{" "}
                    {commande.user?.phone || "Numéro inconnu"}
                  </p>

                  {/* Verification Checkbox */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex items-center gap-2 text-sm font-medium ${
                        commande.verified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {commande.verified ? (
                        <>
                          <FiCheckCircle size={18} />
                          Vérifiée
                        </>
                      ) : (
                        <>
                          <FiXCircle size={18} />
                          En attente
                        </>
                      )}
                    </span>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring focus:ring-green-500"
                        checked={commande.verified || false}
                        onChange={(e) =>
                          toggleVerification(commande._id, e.target.checked)
                        }
                      />
                      <span className="text-sm">Vérifier</span>
                    </label>
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

export default CommandesAdmin;
