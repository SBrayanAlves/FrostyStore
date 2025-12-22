import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../pages/dashboard_components/Sidebar";
import Showcase from "../pages/dashboard_components/Showcase";

interface StoreLayout {
    user: User | null;
    isLoading: boolean;
    isOwner: boolean;
}

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  bio: string;
}

function StoreLayout({ user, isLoading, isOwner }: StoreLayout) {
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  
  if (!user) return <div className="h-screen flex items-center justify-center">Usuário não encontrado.</div>;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:24px_24px]">
        <Header />

        <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-12">
          <Sidebar data={user} isOwner={isOwner} />
          <Showcase username={user.username} isOwner={isOwner} />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default StoreLayout;


