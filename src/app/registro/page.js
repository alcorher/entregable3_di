'use client';
import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validarFormulario = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    } else if (!username || !mail || !password || !confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  };

  
  return (
   <div>
    <img src="/images/logo.png" width="30%" />
    <h1>Registro</h1>
        <form onSubmit={(e) => validarFormulario(e)}>
            <label htmlFor="username">Nombre de Usuario:</label>
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="mail">Correo Electrónico:</label>
            <input type="email" id="mail" name="mail" value={mail} onChange={(e) => setMail(e.target.value)} />
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <a href="/login">¿Ya tienes una cuenta? Inicia Sesión</a>
            <button type="submit">Registrarse</button>
        </form>        
    </div>
  );
}