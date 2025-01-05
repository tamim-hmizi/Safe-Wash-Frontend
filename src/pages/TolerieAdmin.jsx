import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import backend from "../../env";
Modal.setAppElement("#root");

function TolerieAdmin() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTolerie, setSelectedTolerie] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const calendarRef = useRef(null);

  const fetchToleries = useCallback(async () => {
    try {
      const response = await axios.get(backend + "/tolerie");
      const formattedEvents = response.data.map((tolerie) => {
        const [startHour, startMinute] = tolerie.hour.split(":").map(Number);
        const endHour = startHour + 1;

        const formattedStartHour = startHour.toString().padStart(2, "0");
        const formattedStartMinute = startMinute.toString().padStart(2, "0");
        const formattedEndHour = endHour.toString().padStart(2, "0");
        const formattedEndMinute = startMinute.toString().padStart(2, "0");

        const startTime = `${formattedStartHour}:${formattedStartMinute}:00`;
        const endTime = `${formattedEndHour}:${formattedEndMinute}:00`;

        return {
          id: tolerie._id,
          title: tolerie.voiture
            ? tolerie.voiture.name
            : `Tolerie (${tolerie.color})`,
          start: `${tolerie.date}T${startTime}`,
          end: `${tolerie.date}T${endTime}`,
          extendedProps: tolerie,
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching toleries:", error);
    }
  }, []);

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

  useEffect(() => {
    if (!user?.email) navigate("/signin");
    if (user?.role === "user") navigate("/");

    fetchToleries();
  }, [user, navigate, fetchToleries]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleEventClick = (info) => {
    setSelectedTolerie(info.event.extendedProps);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTolerie(null);
  };

  const handleDelete = async () => {
    if (!selectedTolerie) return;

    try {
      await axios.delete(`${backend}/tolerie/${selectedTolerie._id}`);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedTolerie._id)
      );
      closeModal();
    } catch (error) {
      console.error("Error deleting tolerie:", error);
    }
  };

  return (
    <div className="p-4 text-gray-500 min-h-screen">
      <h1 className="text-3xl text-white font-bold text-center mb-6">
        Gestion Tolerie
      </h1>
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
            slotDuration: "01:00:00",
            slotMinTime: "08:00:00",
            slotMaxTime: "21:00:00",
          },
          timeGridDay: {
            allDaySlot: false,
            slotDuration: "01:00:00",
            slotMinTime: "08:00:00",
            slotMaxTime: "21:00:00",
          },
        }}
        events={events}
        eventContent={(eventInfo) => (
          <div className="flex items-center justify-between">
            <span>{eventInfo.event.title}</span>
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
        contentLabel="Détails de Tolerie"
        className="bg-gray-800 text-gray-100 max-w-md mx-auto p-6 rounded-lg shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        {selectedTolerie && (
          <div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Détails de la Tolerie
            </h2>
            <p>
              <strong>Couleur:</strong> {selectedTolerie.color}
            </p>
            <p>
              <strong>Date:</strong> {selectedTolerie.date}
            </p>
            <p>
              <strong>Heure:</strong> {selectedTolerie.hour}
            </p>

            {selectedTolerie.voiture && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Détails de la Voiture
                </h3>
                <p>
                  <strong>Nom:</strong> {selectedTolerie.voiture.name || "N/A"}
                </p>
                <p>
                  <strong>Modèle:</strong>{" "}
                  {selectedTolerie.voiture.model || "N/A"}
                </p>
                <p>
                  <strong>Année:</strong>{" "}
                  {selectedTolerie.voiture.year || "N/A"}
                </p>
                <p>
                  <strong>Matricule:</strong>{" "}
                  {selectedTolerie.voiture.matricule || "N/A"}
                </p>
              </div>
            )}

            {selectedTolerie.user && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Détails du client
                </h3>
                <p>
                  <strong>Nom:</strong>{" "}
                  {selectedTolerie.user.name +
                    " " +
                    selectedTolerie.user.lastName || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {selectedTolerie.user.email || "N/A"}
                </p>
                <p>
                  <strong>Téléphone:</strong>{" "}
                  {selectedTolerie.user.phone || "N/A"}
                </p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                className="text-red-600 hover:text-red-800 px-4 py-2 rounded mr-2 flex items-center gap-2"
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

export default TolerieAdmin;
