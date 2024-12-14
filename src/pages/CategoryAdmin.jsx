import { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi"; // React icon for trash
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.email === "") navigate("/signin");
    if (user.role === "user") navigate("/");
  }, [user, navigate]);

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Add a new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    axios
      .post("http://localhost:3000/categories", { name: newCategory })
      .then((response) => {
        setCategories((prev) => [...prev, response.data]);
        setNewCategory("");
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  // Delete a category
  const handleDeleteCategory = (id) => {
    axios
      .delete(`http://localhost:3000/categories/${id}`)
      .then(() => {
        setCategories((prev) => prev.filter((category) => category._id !== id));
      })
      .catch((error) => console.error("Error deleting category:", error));
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-900 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Gestion des Catégories
          </h2>

          {/* Category Input and Add Button */}
          <div className="mb-8 flex items-center justify-center">
            <input
              type="text"
              placeholder="Ajouter une catégorie"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 mr-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Ajouter
            </button>
          </div>

          {/* Categories List */}
          {categories.length === 0 ? (
            <p className="text-center text-gray-400">
              Aucune catégorie disponible. Ajoutez-en une !
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>

                  <div className="mt-auto flex items-center justify-between">
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CategoryAdmin;
