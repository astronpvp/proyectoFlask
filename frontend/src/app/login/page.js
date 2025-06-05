"use client";
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 🔐 esto es esencial para que se guarde la cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('Inicio de sesión correcto ✅');
        // Aquí podrías redirigir al perfil o dashboard
        // router.push('/perfil')
      } else {
        setMensaje(data.msg || 'credenciales no validas');
      }
    } catch (err) {
      setMensaje('Error de red o del servidor');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
      <div className="w-80 p-6 rounded shadow-lg bg-white">
        <h1 className="text-2xl mb-2">Iniciar sesión</h1>
        <p className="mb-4 text-gray-600">Mantente al día de tu mundo profesional.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-300 rounded"
          />

          <button type="submit" className="w-full p-3 bg-blue-700 text-white rounded-full font-bold">
            Iniciar sesión
          </button>
        </form>

        {mensaje && <p className="mt-4 text-center text-sm text-gray-700">{mensaje}</p>}
      </div>
    </div>
  );
}
