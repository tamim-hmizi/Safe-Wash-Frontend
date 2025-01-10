import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiList,
  FiPackage,
  FiClipboard,
  FiBarChart,
} from "react-icons/fi";
import { MdOutlineLocalCarWash } from "react-icons/md";
import { GiCarWheel } from "react-icons/gi";
import { RiPaintBrushLine } from "react-icons/ri";
import { TbVacuumCleaner } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.email === "") navigate("/signin");
    if (user.role === "user") navigate("/");
  }, [user, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false); // Close the menu when an item is clicked
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen m-5">
      {/* Mobile Menu */}
      <div className="lg:hidden flex flex-col bg-gray-800 text-white p-4 rounded">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold">Tableau de bord</h2>
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="p-4 bg-gray-800 rounded-lg">
            <ul>
              <li>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <FiBarChart size={20} className="mr-3" />
                  Tableau de Bord
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/categories"
                  onClick={closeMobileMenu} // Close the menu on click
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <FiList size={20} className="mr-3" />
                  Catégories
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/products"
                  onClick={closeMobileMenu}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <FiPackage size={20} className="mr-3" />
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/commandes"
                  onClick={closeMobileMenu}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <FiClipboard size={20} className="mr-3" />
                  Commandes
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/lavages"
                  onClick={closeMobileMenu}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <MdOutlineLocalCarWash size={20} className="mr-3" />
                  Lavages
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/detailing"
                  onClick={closeMobileMenu}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <TbVacuumCleaner size={20} className="mr-3" />
                  Détailage
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/polissage"
                  onClick={closeMobileMenu}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <GiCarWheel size={20} className="mr-3" />
                  Polissage
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/tolerie"
                  onClick={closeMobileMenu}
                  className="flex items-center py-2 px-4 text-white hover:bg-gray-900 rounded-lg"
                >
                  <RiPaintBrushLine size={20} className="mr-3" />
                  Tôlerie
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar for larger screens */}
      <div
        className={`hidden lg:block  bg-gray-800 p-4 text-white sticky h-full rounded-lg mt-5`}
      >
        <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
        <ul>
          <li>
            <Link
              to="/dashboard"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <FiBarChart size={20} className="mr-3" />
              Tableau de Bord
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/categories"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <FiList size={20} className="mr-3" />
              Catégories
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/products"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <FiPackage size={20} className="mr-3" />
              Produits
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/commandes"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <FiClipboard size={20} className="mr-3" />
              Commandes
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/lavages"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <MdOutlineLocalCarWash size={20} className="mr-3" />
              Lavages
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/detailing"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <TbVacuumCleaner size={20} className="mr-3" />
              Détailage
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/polissage"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <GiCarWheel size={20} className="mr-3" />
              Polissage
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/tolerie"
              className="flex items-center py-2 px-4 mb-2 text-white hover:bg-gray-900 rounded-lg"
            >
              <RiPaintBrushLine size={20} className="mr-3" />
              Tôlerie
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 lg:pl-16">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
