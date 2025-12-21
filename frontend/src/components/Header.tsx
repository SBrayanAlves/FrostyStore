import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    // A tag header continua fixa
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      
      {/* CORREÇÃO AQUI:
         1. Removi 'py-4' (que causava a oscilação dependendo do conteúdo).
         2. Adicionei 'h-20' (define uma altura fixa de 80px, ou use h-16 para 64px).
         3. 'flex items-center' garante que tanto o logo quanto o botão fiquem no meio dessa altura fixa.
      */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        <Link to="/" className="font-semibold tracking-wide text-lg">
          FrostyStore
        </Link>

        {!isLoginPage && (
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium border border-black rounded-full hover:bg-black hover:text-white transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;