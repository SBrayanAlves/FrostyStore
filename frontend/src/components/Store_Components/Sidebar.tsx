import { Link } from "react-router-dom";
import type { Seller } from "../../Types/Seller";
import type { User } from "../../Types/User";

interface SidebarProps {
  data: Seller | User;
  isOwner: boolean;
}

const BASE_URL = "http://localhost:8000";

function Sidebar({ data, isOwner }: SidebarProps) {

  const avatarUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${BASE_URL}${path}`;
  }


  return (
    <aside className="w-full md:w-80 shrink-0">
      <div className="sticky top-24">
        <div className="relative mt-12 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 text-center group transition-all duration-500 hover:shadow-md">
          
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-500 to-cyan-400 rounded-t-3xl opacity-10"></div>

          <div className="relative inline-block -mt-16 mb-4">
            <div className="p-1 bg-white rounded-full shadow-sm">
              <img
                src={avatarUrl(data.profile_picture) || '/default_avatar.png'}
                alt={`Foto de ${data.username}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {data.first_name} {data.last_name}
            </h2>
            <p className="text-sm font-medium text-brand-500 mb-3">
              @{data.username}
            </p>

            <p className="text-sm text-slate-500 leading-relaxed mb-6 px-2">
              {data.bio || "Sem biografia."}
            </p>

            {isOwner && (
              <Link
                // Se já estiver na edição, manda pro perfil, senão manda pra edição
                to={location.pathname.includes('/edit') ? "/dashboard" : "/dashboard/me/edit"}
                className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                {/* Ícone muda dependendo da tela */}
                <i className={`fa-regular ${location.pathname.includes('/edit') ? 'fa-user' : 'fa-pen-to-square'}`}></i>
                
                {/* Texto muda dependendo da tela */}
                {location.pathname.includes('/edit') ? 'Ver Perfil' : 'Editar Perfil'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;