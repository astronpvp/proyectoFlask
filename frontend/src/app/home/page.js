"use client";
import Lines from "@/components/Lines";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [userRol, setUserRol] = useState("");
  const [ofertas, setOfertas] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);

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

    const fetchInscripciones = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inscripciones/mis-inscripciones', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          // Extraemos solo los ids de publicaciones
          const ids = data.map(ins => ins.id_publicacion);
          setInscripciones(ids);
        } else {
          console.error("Error al cargar inscripciones", data.msg || data);
        }
      } catch (error) {
        console.error("Error fetch inscripciones:", error);
      }
    };

    // Fetch ofertas from API
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
  }, []);

    

  const ofertasFiltradas = ofertas.filter((oferta) => {
    const coincideBusqueda = oferta.titulo.toLowerCase().includes(search.toLowerCase());
    if (filter === "todos") return coincideBusqueda;

    // Si filtro es "curso", mostramos todo (cursos + trabajos)
    if (filter === "curso") return coincideBusqueda && oferta.tipo === "curso";

    // Si filtro es "trabajo", mostramos solo trabajos
    if (filter === "oferta") return coincideBusqueda && oferta.tipo === "Oferta";

     return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
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
        <button
          title="Añadir oferta"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition z-50"
        >
          +
        </button>
      )}

      <div className="max-w-4xl mx-auto">
        {ofertasFiltradas.map((oferta, idx) => (
          <Lines key={idx} oferta={oferta} />
        ))}
      </div>
    </div>
  );
}
