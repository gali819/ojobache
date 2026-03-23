import { Heart, Coffee, DollarSign } from 'lucide-react'

function Donaciones() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Apoyá OjoBache</h1>
      <p className="text-gray-600 mb-8">
        OjoBache es un proyecto gratuito y sin publicidad mantenido por la comunidad.
        Si querés ayudarnos a seguir mejorando, podés colaborar con una donación.
      </p>

      <div className="grid gap-4">
        <DonationCard
          icon={<Coffee size={32} />}
          title="Invitame un café"
          description="Una donación pequeña para cubrir los costos del servidor."
          color="bg-amber-50 border-amber-200"
        />
        <DonationCard
          icon={<Heart size={32} className="text-red-500" />}
          title="Doná con Mercado Pago"
          description="Ayudanos con lo que puedas, cualquier monto es bienvenido."
          color="bg-red-50 border-red-200"
        />
        <DonationCard
          icon={<DollarSign size={32} className="text-green-600" />}
          title="Transferencia bancaria"
          description="Escribinos a ojobache@gmail.com para recibir los datos bancarios."
          color="bg-green-50 border-green-200"
        />
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        ¡Gracias por ser parte de OjoBache! 🕳️
      </p>
    </div>
  )
}

function DonationCard({ icon, title, description, color }) {
  return (
    <div className={`flex items-start gap-4 p-5 border rounded-xl ${color}`}>
      <div className="text-amber-600 flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  )
}

export default Donaciones
