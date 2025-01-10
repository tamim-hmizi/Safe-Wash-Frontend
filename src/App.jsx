import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Lavage from "./pages/Lavage";
import Tolerie from "./pages/Tolerie";
import Polissage from "./pages/Polissage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProductAdmin from "./pages/ProductAdmin";
import CategoryAdmin from "./pages/CategoryAdmin";
import Commandes from "./pages/Commandes";
import CommandesAdmin from "./pages/CommandesAdmin";
import Reservation from "./pages/Reservation";
import LavageAdmin from "./pages/LavageAdmin";
import Detailing from "./pages/Detailing";
import DetailingAdmin from "./pages/DetaillingAdmin";
import PolissageAdmin from "./pages/PolissageAdmin";
import TolerieAdmin from "./pages/TolerieAdmin";
import Stats from "./pages/Stats";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/mes-commandes" element={<Commandes />} />
            <Route path="/mes-reservation" element={<Reservation />} />
            <Route path="/services/lavage" element={<Lavage />} />
            <Route path="/services/tolerie" element={<Tolerie />} />
            <Route path="/services/polissage" element={<Polissage />} />
            <Route path="/services/detailing" element={<Detailing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Stats />} />
              <Route path="/categories" element={<CategoryAdmin />} />
              <Route path="/products" element={<ProductAdmin />} />
              <Route path="/commandes" element={<CommandesAdmin />} />
              <Route path="/lavages" element={<LavageAdmin />} />
              <Route path="/detailing" element={<DetailingAdmin />} />
              <Route path="/polissage" element={<PolissageAdmin />} />
              <Route path="/tolerie" element={<TolerieAdmin />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
