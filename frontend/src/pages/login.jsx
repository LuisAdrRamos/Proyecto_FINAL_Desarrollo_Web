import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../components/MensajeLogin';
import '../styles/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    tipoUsuario: "usuario" // Valor predeterminado
  });

  const [mensaje, setMensaje] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = form.tipoUsuario === "admin"
        ? `${import.meta.env.VITE_BACKEND_URL}/admin/login`
        : `${import.meta.env.VITE_BACKEND_URL}/usuario/login`;

      const respuesta = await axios.post(url, form);

      if (respuesta?.data) {
        setMensaje({ respuesta: respuesta.data.msg, tipo: true });

        if (respuesta.data.token) {
          localStorage.setItem('token', respuesta.data.token);
          localStorage.setItem('tipoUsuario', respuesta.data.rol); // Guardar el rol correctamente

          console.log("Rol guardado en localStorage:", respuesta.data.rol); // Debug

          // Redirigir según el rol
          if (respuesta.data.rol === "admin") {
            navigate('/');
          } else if (respuesta.data.rol === "usuario") {
            navigate('/');
          } else {
            setMensaje({ respuesta: "Rol desconocido", tipo: false });
          }
        }

        setForm({
          email: "",
          password: "",
          tipoUsuario: "usuario"
        });
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Error al iniciar sesión';
      setMensaje({ respuesta: errorMsg, tipo: false });
      console.error('Error:', error.message);
    }
  };

  return (
    <div className='login-body'>
      <Link className="brand" to="/">
        <div className="brand-content">
          <FontAwesomeIcon icon={faKeyboard} className="brand-icon" />
          <span className="brand-text">BestKeyboard</span>
        </div>
      </Link>
      <div className="login-wrapper">
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Tipo de usuario:</label>
            <select name="tipoUsuario" className="form-control" onChange={handleChange} value={form.tipoUsuario}>
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <p className="forgot-password">
            <Link to="/forgot/id" className="forgot-link">¿Olvidaste tu contraseña?</Link>
          </p>
          <button type="submit" className="btn btn-primary">Iniciar sesión</button>
          <p className="text-center mt-3">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="register-link">Regístrate</Link>
          </p>
        </form>
        {mensaje.respuesta && (
          <Mensaje tipo={mensaje.tipo ? 'success' : 'error'}>
            {mensaje.respuesta}
          </Mensaje>
        )}
      </div>
    </div>
  );
};

export default Login;