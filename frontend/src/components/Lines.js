"use client";

export default function Lines({ oferta }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      {/* Título y tipo */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{oferta.titulo}</h2>
        <span
          className={
            oferta.tipo === "curso"
              ? "px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
              : "px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800"
          }
        >
          {oferta.tipo.toUpperCase()}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 mb-4">{oferta.descripcion}</p>

      {/* Detalles generales */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13 21.314l-4.657-4.657a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {oferta.ubicacion}
        </div>

        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 12V4m0 0L8 8m4-4l4 4" />
          </svg>
          {oferta.modalidad}
        </div>

        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10m-2 5h.01M6 14h.01" />
            <rect x="3" y="7" width="18" height="14" rx="2" ry="2"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
          {new Date(oferta.fecha_inicio).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Otros detalles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <div>
          <p><span className="font-medium">Contrato:</span> {oferta.tipo_contrato}</p>
          <p><span className="font-medium">Salario:</span> {oferta.salario} €</p>
          <p><span className="font-medium">Plazas:</span> {oferta.plazas}</p>
        </div>
        <div>
          <p><span className="font-medium">Requisitos:</span> {oferta.requisitos}</p>
          {oferta.duracion && (
            <p><span className="font-medium">Duración:</span> {oferta.duracion}</p>
          )}
        </div>
      </div>

      {/* Botones: Ver detalle + Inscribirse */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition">
          Ver detalle
        </button>
        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition">
          Inscribirse
        </button>
      </div>
    </div>
  );
}
