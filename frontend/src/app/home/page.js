"use client";
import Lines from "@/components/Lines";
import { useState, useEffect } from "react";
import Publicacion from "@/components/Publicacion";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [userRol, setUserRol] = useState("");
  const [ofertas, setOfertas] = useState([]);
  const [misPublicaciones, setMisPublicaciones] = useState([]); // <-- publicaciones inscritas
  const [modalOpen, setModalOpen] = useState(false); // <-- estado para el modal

  useEffect(() => {
    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/usuarios/perfil', {
          method: 'GET',
          credentials: 'include',
        });
        const json = await res.json();
        if (res.ok) {
          setUserRol(json.rol);
          if (json.rol === "admin") {
            alert("Eres administrador");
          }
        } else {
          console.log(json.msg || 'No autorizado');
        }
      } catch (err) {
        console.error('Error de red o del servidor', err);
      }
    };

    // Fetch publicaciones inscritas (mis publicaciones)
    const fetchMisPublicaciones = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inscripciones/mis-publicaciones', {
          method: 'GET',  // según curl que diste
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        
        });
        const data = await res.json();
        if (res.ok) {
          setMisPublicaciones(data);
        
        } else {
          console.error("Error al cargar mis publicaciones", data.msg || data);
        }
      } catch (error) {
        console.error("Error en fetch mis publicaciones:", error);
      }
    };

    // Fetch ofertas
    const fetchOfertas = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/publicaciones");
        const data = await res.json();
        if (res.ok) {
          setOfertas(data);
        } else {
          console.error("Error al cargar ofertas", data.msg || data);
        }
      } catch (error) {
        console.error("Error en fetch de ofertas:", error);
      }
    };

    fetchUserProfile();
    fetchOfertas();
    fetchMisPublicaciones();
  }, []);

  const ofertasFiltradas = ofertas.filter((oferta) => {
    const coincideBusqueda = oferta.titulo.toLowerCase().includes(search.toLowerCase());
    if (filter === "todos") return coincideBusqueda;
    if (filter === "curso") return coincideBusqueda && oferta.tipo === "curso";
    if (filter === "oferta") return coincideBusqueda && oferta.tipo === "Oferta";
    return false;
  });

  // Función para cerrar modal al hacer click fuera o en la X
  const closeModal = () => setModalOpen(false);

  return (
    <>
    <div className="min-h-screen bg-gray-100 py-10 px-6 relative">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Ofertas Disponibles
      </h1>

      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por título..."
          className="w-full md:w-2/3 px-4 py-2 rounded border border-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-300"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="curso">Cursos</option>
          <option value="oferta">Ofertas</option>
        </select>
      </div>

      {userRol === "admin" && (
        <>
          <button
            title="Añadir oferta"
            onClick={() => setModalOpen(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition z-50"
          >
            +
          </button>

          {/* Modal */}
          {modalOpen && (
            <div
              className="fixed inset-0 bg-black/40 flex items-center justify-center py-[30px] z-50"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative max-h-[calc(100vh-60px)] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
                  onClick={closeModal}
                  aria-label="Cerrar modal"
                >
                  &times;
                </button>
                
                <Publicacion />
                
              </div>
            </div>
          )}

        </>
      )}

      <div className="max-w-4xl mx-auto">
        {ofertasFiltradas.map((oferta, idx) => (
          <Lines key={idx} oferta={oferta} misPublicaciones={misPublicaciones} />
        ))}
      </div>
    </div>
    </>
  );
}
