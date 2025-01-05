import { useEffect, useState } from "react";
import axios from "axios";

import { FaCar } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import { TbVacuumCleaner } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import backend from "../../env";
function Stats() {
  const [lavages, setLavages] = useState([]);
  const [polissages, setPolissages] = useState([]);
  const [detailings, setDetailings] = useState([]);
  const [stats, setStats] = useState({ monthly: {}, yearly: {}, allTime: {} });
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?.email) navigate("/signin");
    if (user?.role === "user") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lavagesData, polissagesData, detailingsData] = await Promise.all(
          [
            axios.get(backend + "/lavages"),
            axios.get(backend + "/polissage"),
            axios.get(backend + "/detailing"),
          ]
        );

        setLavages(lavagesData.data);
        setPolissages(polissagesData.data);
        setDetailings(detailingsData.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateStats = () => {
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
      const currentYear = String(now.getFullYear());

      const calculateRevenue = (data, field = "price") =>
        data.reduce((acc, item) => acc + parseFloat(item[field] || 0), 0);

      const filterByDate = (data, month, year) =>
        data.filter((item) => {
          const [itemYear, itemMonth] = item.date.split("-"); // Supposons que la date est au format "YYYY-MM-DD"
          return itemMonth === month && itemYear === year;
        });

      const monthlyLavages = filterByDate(lavages, currentMonth, currentYear);
      const yearlyLavages = lavages.filter(
        (item) => item.date.split("-")[0] === currentYear
      );
      const monthlyPolissages = filterByDate(
        polissages,
        currentMonth,
        currentYear
      );
      const yearlyPolissages = polissages.filter(
        (item) => item.date.split("-")[0] === currentYear
      );
      const monthlyDetailings = filterByDate(
        detailings,
        currentMonth,
        currentYear
      );
      const yearlyDetailings = detailings.filter(
        (item) => item.date.split("-")[0] === currentYear
      );

      const allTimeLavages = lavages;
      const allTimePolissages = polissages;
      const allTimeDetailings = detailings;

      const monthlyTotal =
        calculateRevenue(monthlyLavages) +
        calculateRevenue(monthlyPolissages) +
        calculateRevenue(monthlyDetailings);
      const yearlyTotal =
        calculateRevenue(yearlyLavages) +
        calculateRevenue(yearlyPolissages) +
        calculateRevenue(yearlyDetailings);
      const allTimeTotal =
        calculateRevenue(allTimeLavages) +
        calculateRevenue(allTimePolissages) +
        calculateRevenue(allTimeDetailings);

      setStats({
        monthly: {
          lavages: calculateRevenue(monthlyLavages),
          polissages: calculateRevenue(monthlyPolissages),
          detailings: calculateRevenue(monthlyDetailings),
          total: monthlyTotal,
        },
        yearly: {
          lavages: calculateRevenue(yearlyLavages),
          polissages: calculateRevenue(yearlyPolissages),
          detailings: calculateRevenue(yearlyDetailings),
          total: yearlyTotal,
        },
        allTime: {
          lavages: calculateRevenue(allTimeLavages),
          polissages: calculateRevenue(allTimePolissages),
          detailings: calculateRevenue(allTimeDetailings),
          total: allTimeTotal,
        },
      });
    };

    calculateStats();
  }, [lavages, polissages, detailings]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-800 rounded-lg flex flex-col items-center">
          <FaCar size={40} className="text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold">Lavage</h3>
          <p>Mensuel : {stats.monthly.lavages || 0} TND</p>
          <p>Annuel : {stats.yearly.lavages || 0} TND</p>
          <p>Total : {stats.allTime.lavages || 0} TND</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg flex flex-col items-center">
          <GiCarWheel size={40} className="text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold">Polissage</h3>
          <p>Mensuel : {stats.monthly.polissages || 0} TND</p>
          <p>Annuel : {stats.yearly.polissages || 0} TND</p>
          <p>Total : {stats.allTime.polissages || 0} TND</p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg flex flex-col items-center">
          <TbVacuumCleaner size={40} className="text-green-500 mb-4" />
          <h3 className="text-xl font-semibold">Détailage</h3>
          <p>Mensuel : {stats.monthly.detailings || 0} TND</p>
          <p>Annuel : {stats.yearly.detailings || 0} TND</p>
          <p>Total : {stats.allTime.detailings || 0} TND</p>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
        <h3 className="text-xl font-semibold">Total Général</h3>
        <p>Revenu Mensuel : {stats.monthly.total || 0} TND</p>
        <p>Revenu Annuel : {stats.yearly.total || 0} TND</p>
        <p>Revenu Total : {stats.allTime.total || 0} TND</p>
      </div>
    </div>
  );
}

export default Stats;
