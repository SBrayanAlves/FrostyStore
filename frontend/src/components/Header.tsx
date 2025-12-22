import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDashBoardPage = location.pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    const acessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      await api.post("http://127.0.0.1:8000/api/auth/logout/", { refresh: refreshToken }, {
                headers: {
                    Authorization: `Bearer ${acessToken}`,
                },
            });
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed. Please try again.");
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
        }
    };

  return (
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
