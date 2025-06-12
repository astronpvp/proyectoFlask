"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function Publicacion() {
  const [datos, setDatos] = useState({
    tipo: "curso",         
    titulo: "",
    descripcion: "",
    ubicacion: "",
    tipo_contrato: "",
    salario: "",
    requisitos: "",
    duracion: "",
    modalidad: "",
    fecha_inicio: "",
    plazas: ""
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://proyectoflask-20er.onrender.com/api/publicaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ Publicación enviada correctamente');
        // Limpiar campos tras envío
        setDatos({
          tipo: "curso",
          titulo: "",
          descripcion: "",
          ubicacion: "",
          tipo_contrato: "",
          salario: "",
          requisitos: "",
          duracion: "",
          modalidad: "",
          fecha_inicio: "",
          plazas: ""
        });
      } else {
        setMensaje(data.msg || '❌ Error al publicar');
      }
    } catch (err) {
      setMensaje('⚠️ Error de red o servidor');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white text-black font-sans p-6">
      <Image src="/logo.png" alt="IngeniaJob logo" width={200} height={50} className="mx-auto mb-2" />


      <div className="w-full max-w-4xl p-8 rounded shadow-lg bg-white border border-gray-200">
        <h1 className="text-2xl font-semibold mb-6 text-center">Crear publicación</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-800">
          {/* Selección de Tipo (Curso / Trabajo) */}
          <div className="md:col-span-2">
            <label className="block mb-1">Tipo de publicación</label>
            <select
              name="tipo"
              value={datos.tipo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="curso">Curso</option>
              <option value="Oferta">Oferta</option>
            </select>
          </div>

          {/* Columna 1 */}
          <div>
            <label className="block mb-1">Título</label>
            <input
              name="titulo"
              value={datos.titulo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block mt-4 mb-1">Ubicación</label>
            <input
              name="ubicacion"
              value={datos.ubicacion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            {/* Solo aplica si es trabajo (pero opcional aquí) */}
            <label className="block mt-4 mb-1">Tipo de contrato</label>
            <input
              name="tipo_contrato"
              value={datos.tipo_contrato}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block mt-4 mb-1">Salario (€)</label>
            <input
              type="number"
              name="salario"
              value={datos.salario}
              onChange={handleChange}
              placeholder="Ej: 32000"
              className="w-full p-2 border rounded"
              required
            />

            <label className="block mt-4 mb-1">Requisitos</label>
            <input
              name="requisitos"
              value={datos.requisitos}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Columna 2 */}
          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block mt-4 mb-1">Duración</label>
            <input
              name="duracion"
              value={datos.duracion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <label className="block mt-4 mb-1">Modalidad</label>
            <input
              name="modalidad"
              value={datos.modalidad}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block mt-4 mb-1">Fecha de inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={datos.fecha_inicio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block mt-4 mb-1">Plazas</label>
            <input
              type="number"
              name="plazas"
              value={datos.plazas}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Botón de enviar (ocupa ambas columnas) */}
          <div className="col-span-1 md:col-span-2">
            <button type="submit" className="w-full p-3 bg-blue-700 text-white rounded-full font-bold">
              Publicar
            </button>
            {mensaje && <p className="mt-4 text-center text-sm text-gray-700">{mensaje}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
