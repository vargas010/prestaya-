// frontend/src/pages/Login.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      })

      const data = await res.json()
      console.log("data:", data)

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      localStorage.setItem('token', data.token)
      console.log("🔐 token guardado:", data.token)

      setTimeout(() => {
        navigate('/')
      }, 100)

    } catch (err: any) {
      setError(err.message || 'Error de red')
    }
  }

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>

      <p style={{ marginTop: '10px' }}>
        ¿No tienes cuenta?{' '}
        <a href="/registro" style={{ color: 'blue' }}>
          Regístrate aquí
        </a>
      </p>
    </div>
  )
}

export default Login
