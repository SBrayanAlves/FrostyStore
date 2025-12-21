import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        email,
        password,
      });
      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <>
      <Header />

      <main>
        <section className="min-h-[calc(100vh-96px)] flex flex-col justify-center items-center text-center px-6">
          <div className="w-full max-w-md">
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
              <h1 className="text-2xl font-semibold text-center mb-2">
                Entrar
              </h1>

              <p className="text-center text-gray-500 mb-8 text-sm">
                Acesse sua conta para continuar
              </p>

              <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="
                    w-full px-4 py-3 rounded-xl 
                    bg-white text-black 
                    border border-gray-300 
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-black 
                    transition
                    "
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="
                    w-full px-4 py-3 rounded-xl 
                    bg-white text-black 
                    border border-gray-300 
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-black 
                    transition
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 transition"
                >
                  Entrar
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Login;
