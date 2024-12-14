import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/signin");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md border-b border-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              className="text-gray-300 hover:text-blue-500 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:flex flex-col lg:flex-row lg:space-x-6 w-full lg:w-auto bg-gray-900 lg:bg-transparent absolute lg:static top-16 left-0 lg:left-auto lg:top-auto z-40 lg:z-auto shadow-md lg:shadow-none`}
          >
            {user.role !== "admin" && (
              <>
                <Link
                  to="/"
                  className="block lg:inline-block px-4 py-2 text-gray-300 hover:text-blue-500 transition duration-300"
                >
                  Accueil
                </Link>
                <Link
                  to="/products"
                  className="block lg:inline-block px-4 py-2 text-gray-300 hover:text-blue-500 transition duration-300"
                >
                  Produits
                </Link>

                <div className="block lg:relative">
                  <button
                    className="text-gray-300 hover:text-blue-500 flex items-center w-full px-4 py-2 focus:outline-none transition duration-300"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Services
                    {isDropdownOpen ? (
                      <FiChevronUp className="ml-1" />
                    ) : (
                      <FiChevronDown className="ml-1" />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="lg:absolute lg:top-full lg:mt-2 bg-gray-800 shadow-lg border border-gray-700 lg:rounded-md lg:w-48 lg:left-0 w-full lg:block">
                      <Link
                        to="/services/lavage"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-300"
                      >
                        Lavage
                      </Link>
                      <Link
                        to="/services/tolerie"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-300"
                      >
                        Tôlerie
                      </Link>
                      <Link
                        to="/services/polissage"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-300"
                      >
                        Polissage
                      </Link>
                      <Link
                        to="/services/detailing"
                        className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-300"
                      >
                        Détailage
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/contact"
                  className="block lg:inline-block px-4 py-2 text-gray-300 hover:text-blue-500 transition duration-300"
                >
                  Contact
                </Link>
              </>
            )}

            {user.email ? (
              <div className="block lg:relative">
                <button
                  className="text-gray-300 hover:text-blue-500 flex items-center w-full px-4 py-2 focus:outline-none transition duration-300"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {user.name + " " + user.lastName}
                  {isUserDropdownOpen ? (
                    <FiChevronUp className="ml-1" />
                  ) : (
                    <FiChevronDown className="ml-1" />
                  )}
                </button>
                {isUserDropdownOpen && (
                  <div className="lg:absolute lg:top-full lg:mt-2 bg-gray-800 shadow-lg border border-gray-700 lg:rounded-md lg:w-48 lg:right-0 w-full lg:block">
                    {user.role !== "admin" && (
                      <>
                        <Link
                          to="/mes-commandes"
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-300"
                        >
                          Mes Commandes
                        </Link>
                        <Link
                          to="/mes-reservation"
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-300"
                        >
                          Mes Réservation
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition duration-300"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="block lg:inline-block px-4 py-2 text-gray-300 hover:text-blue-500 transition duration-300"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
