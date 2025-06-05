"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: nombre, // Combina nombre completo si es necesario
      email,
      password,
      rol: apellidos, // Puedes cambiarlo por 'usuario' o hacerlo dinámico si quieres
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('Registro exitoso ✅');
        // Opcional: redirigir a login
        // router.push('/login')
      } else {
        setMensaje(data.mensaje || 'Error en el registro');
      }
    } catch (err) {
      console.error(err);
      setMensaje('Error de red o del servidor');
    }
  };

  return (
    <div className="text-center min-h-screen bg-white text-black font-sans">
      <div className="pt-4">
        <Image src="/logo.png" alt="IngeniaJob logo" width={200} height={50} className="mx-auto mb-4" />

        <div className="w-96 mx-auto text-left rounded-lg p-6 shadow-lg bg-white">
          <h1 className="text-2xl mb-2">Únete a IngeniaJob</h1>
          <p className="mb-4 text-gray-600">Encuentra el trabajo ideal o el curso que necesitas.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Rol"
              required
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded"
            />
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

            <p className="text-xs text-gray-500 mb-4">
              Al hacer clic en “Aceptar y unirse”, aceptas las{' '}
              <Link href="#" className="text-blue-700">Condiciones de uso</Link>, la{' '}
              <Link href="#" className="text-blue-700">Política de privacidad</Link> y la{' '}
              <Link href="#" className="text-blue-700">Política de cookies</Link> de IngeniaJob.
            </p>

            <button type="submit" className="w-full p-3 bg-blue-700 text-white rounded-full font-bold">
              Aceptar y unirse
            </button>
          </form>

          {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
        </div>

        <p className="mt-5 text-sm">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-blue-700">Iniciar sesión</Link>
        </p>

        <footer className="mt-12 text-xs text-gray-500 space-x-3">
          <p>IngeniaJob © 2025</p>
          <Link href="#">Condiciones de uso</Link>
          <Link href="#">Política de privacidad</Link>
          <Link href="#">Pautas comunitarias</Link>
          <Link href="#">Política de cookies</Link>
          <Link href="#">Política de copyright</Link>
          <Link href="#">Enviar comentarios</Link>
          <Link href="#">Idioma</Link>
        </footer>
      </div>
    </div>
  );
}
