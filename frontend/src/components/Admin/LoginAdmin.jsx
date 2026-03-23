import { useForm } from 'react-hook-form'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { adminLogin } from '../../services/api'
import useBacheStore from '../../store/useBacheStore'
import LoadingSpinner from '../UI/LoadingSpinner'

function LoginAdmin() {
  const setAdminToken = useBacheStore((s) => s.setAdminToken)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [cargando, setCargando] = useState(false)

  const onSubmit = async (data) => {
    setCargando(true)
    try {
      const res = await adminLogin(data)
      const { token, user } = res.data
      setAdminToken(token, user)
      toast.success('Sesión iniciada')
    } catch {
      toast.error('Credenciales incorrectas')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-center">Acceso Admin</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Requerido' })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              {...register('password', { required: 'Requerido' })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cargando ? <LoadingSpinner size="sm" /> : null}
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginAdmin
