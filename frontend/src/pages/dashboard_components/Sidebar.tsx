import { useEffect, useState } from "react";
import api from "../../services/api";

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  bio: string;
}

function Sidebar() {

  api.get("/username/").then((response) => {
    console.log(response.data);
  })

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/username/").then((response) =>{
      setUser(response.data);
    })
    .catch((error) => {
      console.error("Erro ao buscar usuário", error);
    })
    .finally(() => {
      setLoading(false);
    })
  }, []);

  if (loading) {
    return (
        <aside className="w-full md:w-80 shrink-0">
             <div className="mt-12 bg-white h-96 rounded-3xl animate-pulse bg-slate-200"></div>
        </aside>
    );
  }
  if (!user) return null;

  return (
    <aside className="w-full md:w-80 shrink-0">
      <div className="sticky top-24">
        <div className="relative mt-12 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 text-center overflow-visible group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
          
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-500 to-cyan-400 rounded-t-3xl opacity-10"></div>

          <div className="relative inline-block -mt-16 mb-4">
            <div className="p-1 bg-white rounded-full shadow-sm">
              <img
                src={user.profile_picture}
                alt={`Foto de ${user.username}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div
              className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white"
              title="Vendedor Verificado"
            >
              <i className="fa-solid fa-check"></i>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.first_name} {user.last_name}</h2>
            <p className="text-sm font-medium text-brand-500 mb-3">@{user.username}</p>

            <p className="text-sm text-slate-500 leading-relaxed mb-6 px-2">
              {user.bio || "Este usuário não adicionou uma biografia."}
            </p>

            <a
              href="/perfil"
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-slate-200"
            >
              <i className="fa-regular fa-address-card"></i>
              Meu Perfil
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;