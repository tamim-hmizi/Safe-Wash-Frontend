import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import backend from "../../env";

Modal.setAppElement("#root");

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role == "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    axios
      .get(backend + "/categories")
      .then((response) => setCategories(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      );

    axios
      .get(backend + "/products")
      .then((response) => {
        setAllProducts(response.data);
        setProducts(response.data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des produits :", error)
      );
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when a category is selected

    if (category === "all") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (product) => product.category.name === category.name
      );
      setProducts(filtered);
    }

    if (isSidebarOpen) {
      setIsSidebarOpen(false); // Close sidebar on category selection
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleOrder = () => {
    if (!user.email) {
      navigate("/signin");
      return;
    }

    axios
      .post(backend + "/commandes/", {
        email: user.email,
        productId: selectedProduct._id,
      })
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la commande :", error);
        closeModal();
      });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen m-5">
      {/* Mobile menu */}
      <div className="lg:hidden flex flex-col bg-gray-800 text-white p-4 rounded">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold">Catégories</h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        {isSidebarOpen && (
          <div className="p-4 bg-gray-800 rounded-lg">
            <ul>
              <li
                onClick={() => handleCategorySelect("all")}
                className={`cursor-pointer py-2 px-4 rounded-lg ${
                  selectedCategory === "all"
                    ? "bg-gray-900"
                    : "hover:bg-gray-900"
                }`}
              >
                Toutes les catégories
              </li>
              {categories.map((category) => (
                <li
                  key={category._id}
                  onClick={() => handleCategorySelect(category)}
                  className={`cursor-pointer py-2 px-4 rounded-lg ${
                    selectedCategory === category
                      ? "bg-gray-900"
                      : "hover:bg-gray-900"
                  }`}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar for larger screens */}
      <div className="hidden lg:block  bg-gray-800 p-4 text-white sticky h-full rounded-lg mt-5">
        <h2 className="text-2xl font-bold mb-6">Catégories</h2>
        <ul>
          <li
            onClick={() => handleCategorySelect("all")}
            className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
              selectedCategory === "all" ? "bg-gray-900" : "hover:bg-gray-900"
            }`}
          >
            Toutes les catégories
          </li>
          {categories.map((category) => (
            <li
              key={category._id}
              onClick={() => handleCategorySelect(category)}
              className={`cursor-pointer py-2 px-4 mb-2 rounded-lg ${
                selectedCategory === category
                  ? "bg-gray-900"
                  : "hover:bg-gray-900"
              }`}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 lg:pl-16">
        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un produit"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none"
          />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-60 w-full object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <p className="text-gray-100 font-bold text-lg mb-4">
                  {product.price} TND
                </p>
                <button
                  onClick={() => openModal(product)}
                  className="mt-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Passer une commande
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Confirmer la commande
        </h2>
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={handleOrder}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Confirmer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
