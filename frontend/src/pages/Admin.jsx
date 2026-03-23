import useBacheStore from '../store/useBacheStore'
import LoginAdmin from '../components/Admin/LoginAdmin'
import DashboardAdmin from '../components/Admin/DashboardAdmin'

function Admin() {
  const adminToken = useBacheStore((s) => s.adminToken)

  return adminToken ? <DashboardAdmin /> : <LoginAdmin />
}

export default Admin
