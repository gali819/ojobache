import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { adminLogin } from '../../services/api'
import useBacheStore from '../../store/useBacheStore'

function LoginAdmin() {
  const setAdminToken = useBacheStore((s) => s.setAdminToken)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [cargando, setCargando] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [mostrarPass, setMostrarPass] = useState(false)

  const onSubmit = async (data) => {
    setCargando(true)
    setErrorMsg(null)
    try {
      const res = await adminLogin(data)
      const { token, admin } = res.data
      setAdminToken(token, admin)
      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales incorrectas'
      setErrorMsg(msg)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ background: 'linear-gradient(135deg, #1D3557, #2A9D8F)' }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🕳️</div>
          <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase">OjoBache</p>
          <h2 className="text-xl font-bold text-gray-800 mt-1">Panel de Administración</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                autoComplete="email"
                {...register('email', { required: 'El email es requerido' })}
                className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="admin@ojobache.ar"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={mostrarPass ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password', { required: 'La contraseña es requerida' })}
                className="w-full border rounded-lg pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Error global */}
          {errorMsg && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-red-600 text-white rounded-lg py-2.5 font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginAdmin
