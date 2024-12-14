import { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi"; // React icon for trash
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "react-modal";

Modal.setAppElement("#root");

function ProductAdmin() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    categoryId: "",
  });

  useEffect(() => {
    if (user.email === "") navigate("/signin");
    if (user.role === "user") navigate("/");
  }, [user, navigate]);

  // Fetch products and categories
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));

    axios
      .get("http://localhost:3000/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Open modal for creating a new product
  const openModal = () => {
    setFormData({
      name: "",
      image: "",
      description: "",
      price: "",
      categoryId: "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result, // Store the image as a base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle product form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { ...formData };

    // Create a new product
    axios
      .post("http://localhost:3000/products", productData)
      .then((response) => {
        setProducts((prev) => [...prev, response.data]);
        closeModal();
      })
      .catch((error) => console.error("Error creating product:", error));
  };

  // Handle product deletion
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/products/${id}`)
      .then(() => {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <section className="py-16 px-4 bg-gray-900 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Gestion des Produits
          </h2>

          {/* Add Product Button */}
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-6 py-3 rounded-md mb-6 hover:bg-blue-600 transition-colors"
          >
            Ajouter un produit
          </button>

          {/* Products List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col"
              >
                {/* Product Image */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    <span className="text-gray-500">Image non disponible</span>
                  </div>
                )}

                {/* Product Info */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-400 mb-2">
                  <strong>Description :</strong> {product.description}
                </p>
                <p className="text-gray-400 mb-2">
                  <strong>Prix :</strong> {product.price}TND
                </p>
                <p className="text-gray-400 mb-4">
                  <strong>Catégorie :</strong> {product.category.name}
                </p>

                {/* Product Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 bg-gray-800 text-white rounded-lg shadow-lg z-40"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-40"
      >
        <h2 className="text-xl font-semibold mb-4">Ajouter un produit</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="name">
              Nom du produit
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nom du produit"
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 w-full"
              accept="image/*"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description du produit"
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="price">
              Prix
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Prix du produit"
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="categoryId">
              Catégorie
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 w-full"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Ajouter le produit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProductAdmin;
