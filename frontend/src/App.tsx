import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Store/Home'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Store/Dashboard'
import PublicStore from './pages/Store/PublicStore'
import PerfilUser from './pages/Perfil/PerfilUser'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/p/:slugProduct" element={<Dashboard />} />
        <Route path="/dashboard/me/edit" element={<PerfilUser />} />

        <Route path="/:slug" element={<PublicStore />} />
        <Route path="/:slug/p/:slugProduct" element={<PublicStore />} />
      </Routes>
    </Router>
  )
}

export default App
