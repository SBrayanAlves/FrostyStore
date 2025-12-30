import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  // Verifica se não é home e não é login para mostrar o botão (ajuste opcional para segurança visual)
  const isDashBoardPage = location.pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    // Pegamos o refresh token apenas para enviar para a blacklist
    const refreshToken = localStorage.getItem("refresh_token");
    
    try {
      // Não precisa passar header Authorization, o interceptor faz isso!
      await api.post("auth/logout/", { refresh: refreshToken });
    } catch (error) {
      // Se der erro (ex: token já inválido), apenas logamos.
      // O usuário será deslogado localmente de qualquer forma.
      console.error("Erro ao processar logout no servidor:", error);
    } finally {
      // Limpeza CRÍTICA: Garantir que os nomes batem com o que foi salvo no login
      localStorage.removeItem("access_token"); // Corrigido de "token" para "access_token"
      localStorage.removeItem("refresh_token");
      
      // Redireciona
      navigate("/login");
    }
  };

  return (
    // ... seu JSX continua o mesmo ...
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="font-semibold tracking-wide text-lg">
          FrostyStore
        </Link>

        {isHomePage && (
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium border border-black rounded-full hover:bg-black hover:text-white transition"
          >
            Login
          </Link>
        )}
        
        {isDashBoardPage && (
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-medium border border-black rounded-full hover:bg-black hover:text-white transition"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;