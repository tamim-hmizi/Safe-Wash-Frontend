import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import {
  FaTrashAlt,
  FaCar,
  FaMotorcycle,
  FaRunning,
  FaUser,
  FaTimes,
} from "react-icons/fa";

Modal.setAppElement("#root");

function LavageAdmin() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLavage, setSelectedLavage] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768); // State for responsive width
  const calendarRef = useRef(null);

  // Fetch Lavages with Memoization
  const fetchLavages = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/lavages");
      const formattedEvents = response.data.map((lavage) => {
        const [startHour, startMinute] = lavage.hour.split(":").map(Number);

        // Calculate end time without modifying startHour and startMinute
        let endHour = startHour;
        let endMinute = startMinute + 30;
        if (endMinute >= 60) {
          endMinute -= 60;
          endHour += 1;
        }

        // Format start and end times
        const formattedStartHour = startHour.toString().padStart(2, "0");
        const formattedStartMinute = startMinute.toString().padStart(2, "0");
        const formattedEndHour = endHour.toString().padStart(2, "0");
        const formattedEndMinute = endMinute.toString().padStart(2, "0");

        const startTime = `${formattedStartHour}:${formattedStartMinute}:00`;
        const endTime = `${formattedEndHour}:${formattedEndMinute}:00`;

        return {
          id: lavage._id,
          title:
            lavage.type == "voiture" ? lavage.voiture.name : lavage.moto.name,
          start: `${lavage.date}T${startTime}`,
          end: `${lavage.date}T${endTime}`,
          extendedProps: lavage,
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching lavages:", error);
    }
  }, []);
  // Update calendar view on resize
  useEffect(() => {
    const handleResize = () => {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      if (window.innerWidth < 768) {
        calendarApi.changeView("timeGridDay");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // Ensure user authentication and fetch lavages
  useEffect(() => {
    if (!user?.email) navigate("/signin");
    if (user?.role === "user") navigate("/");

    fetchLavages();
  }, [user, navigate, fetchLavages]);

  // Update view dynamically on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine the icon for a lavage
  const getIcon = (lavage) => {
    if (lavage.type === "voiture" && lavage.lavageType === "rapide")
      return (
        <div className="flex gap-1">
          <FaCar />
          <FaRunning />
        </div>
      );
    if (lavage.type === "moto" && lavage.lavageType === "rapide")
      return (
        <div className="flex gap-1">
          <FaMotorcycle />
          <FaRunning />
        </div>
      );
    if (lavage.type === "moto" && lavage.lavageType === "express")
      return (
        <div className="flex gap-1">
          <FaMotorcycle />
          <FaUser />
        </div>
      );
    if (lavage.type === "voiture" && lavage.lavageType === "express")
      return (
        <div className="flex gap-1">
          <FaCar />
          <FaUser />
        </div>
      );
    return null;
  };

  // Handle clicking an event to open the modal
  const handleEventClick = (info) => {
    setSelectedLavage(info.event.extendedProps);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedLavage(null);
  };

  // Handle deleting a lavage
  const handleDelete = async () => {
    if (!selectedLavage) return;

    try {
      await axios.delete(`http://localhost:3000/lavages/${selectedLavage._id}`);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedLavage._id)
      );
      closeModal();
    } catch (error) {
      console.error("Error deleting lavage:", error);
    }
  };

  return (
    <div className="p-4 text-gray-500  min-h-screen">
      <h1 className="text-3xl text-white font-bold text-center mb-6">
        Gestion Lavage
      </h1>
      <div className="flex justify-around my-2 text-white">
        <p className="flex items-center gap-1">
          <FaCar /> Voiture
        </p>
        <p className="flex items-center gap-1">
          <FaMotorcycle /> Moto
        </p>
        <p className="flex items-center gap-1">
          <FaRunning /> Rapide
        </p>
        <p className="flex items-center gap-1">
          <FaUser /> Express
        </p>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobileView ? "timeGridDay" : "timeGridWeek"}
        headerToolbar={{
          left: "prev,next today",
          right: isMobileView ? "timeGridDay" : "timeGridWeek,timeGridDay",
        }}
        views={{
          timeGridWeek: {
            allDaySlot: false,
            slotDuration: "00:30:00",
            slotMinTime: "08:00:00",
            slotMaxTime: "21:00:00",
          },
          timeGridDay: {
            allDaySlot: false,
            slotDuration: "00:30:00",
            slotMinTime: "08:00:00",
            slotMaxTime: "21:00:00",
          },
        }}
        events={events}
        eventContent={(eventInfo) => (
          <div className="flex items-center justify-between">
            <span>{eventInfo.event.title}</span>
            <span>{getIcon(eventInfo.event.extendedProps)}</span>
          </div>
        )}
        eventClick={handleEventClick}
        height="auto"
        slotEventOverlap={false}
        locale="fr"
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Détails de Lavage"
        className="bg-gray-800 text-gray-100 max-w-md mx-auto p-6 rounded-lg shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        {selectedLavage && (
          <div>
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
            >
              <FaTimes size={20} />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold mb-4 text-center">
              Détails du Lavage
            </h2>

            {/* General Lavage Details */}
            <p>
              <strong>Type de Lavage:</strong> {selectedLavage.lavageType}
            </p>
            <p>
              <strong>Prix:</strong> {selectedLavage.price || "Non défini"} TND
            </p>
            <p>
              <strong>Date:</strong> {selectedLavage.date}
            </p>
            <p>
              <strong>Heure:</strong> {selectedLavage.hour}
            </p>

            {/* User Details */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Informations du client
              </h3>
              <p>
                <strong>Nom:</strong>{" "}
                {selectedLavage.user?.name +
                  " " +
                  selectedLavage.user?.lastName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedLavage.user?.email || "N/A"}
              </p>
              <p>
                <strong>Téléphone:</strong>{" "}
                {selectedLavage.user?.phone || "N/A"}
              </p>
            </div>

            {/* Vehicle Details */}
            <div className="mt-4">
              {selectedLavage.type === "voiture" ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Détails de la Voiture
                  </h3>
                  <p>
                    <strong>Nom:</strong>{" "}
                    {selectedLavage.voiture?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Modèle:</strong>{" "}
                    {selectedLavage.voiture?.model || "N/A"}
                  </p>
                  <p>
                    <strong>Année:</strong>{" "}
                    {selectedLavage.voiture?.year || "N/A"}
                  </p>
                  <p>
                    <strong>Matricule:</strong>{" "}
                    {selectedLavage.voiture?.matricule || "N/A"}
                  </p>
                  <p>
                    <strong>Taille:</strong>{" "}
                    {selectedLavage.voiture?.taille || "N/A"}
                  </p>
                </>
              ) : selectedLavage.type === "moto" ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">
                    Détails de la Moto
                  </h3>
                  <p>
                    <strong>Nom:</strong> {selectedLavage.moto?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Taille:</strong>{" "}
                    {selectedLavage.moto?.taille || "N/A"}
                  </p>
                </>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6">
              <button
                className=" text-red-600 hover:text-red-800 px-4 py-2 rounded mr-2 flex items-center gap-2"
                onClick={handleDelete}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default LavageAdmin;
