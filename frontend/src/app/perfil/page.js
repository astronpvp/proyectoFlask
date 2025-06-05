"use client";
import { useState } from 'react';

export default function Login() {
  const [data, setData] = useState(null); // 🆕 Para guardar el perfil
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/usuarios/perfil', {
        method: 'GET',
        credentials: 'include', // Necesario para enviar la cookie
      });

      const json = await res.json();

      if (res.ok) {
        setData(JSON.stringify(json)); // Puedes formatearlo como quieras
        setMensaje('Perfil recibido ✅');
      } else {
        setMensaje(json.msg || 'No autorizado');
      }
    } catch (err) {
      setMensaje('Error de red o del servidor');
      console.error(err);
    }
  };

  const handleLogOut = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Necesario para enviar la cookie
      });

      const json = await res.json();

      if (res.ok) {
        setData(JSON.stringify(json)); // Puedes formatearlo como quieras
        setMensaje('Perfil cerrado');
      } else {
        setMensaje(json.msg || 'No cerrado sesion');
      }
    } catch (err) {
      setMensaje('Error de red o del servidor');
      console.error(err);
    }

  };

  return (
    <div className="p-4">
      <button onClick={handleSubmit} className="bg-blue-700 text-white px-4 py-2 rounded">Mostrar perfil</button>

      {mensaje && <p className="mt-2">{mensaje}</p>}
      {data && <pre className="bg-gray-100 p-2 mt-2 text-sm">{data}</pre>}

      <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded" onClick={handleLogOut}>Cerrar sesión</button>
    </div>
  );
}
