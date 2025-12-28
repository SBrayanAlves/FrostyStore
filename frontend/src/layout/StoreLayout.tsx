import Header from "../components/Global/Header";
import Footer from "../components/Global/Footer";
import Sidebar from "../components/Store_Components/Sidebar";
import Showcase from "../components/Store_Components/Showcase";
import type { Seller } from "../Types/Seller";
import type { Product } from "../Types/Product";

interface StoreLayout {
    user: Seller | null;
    products: Product[];
    isLoading: boolean;
    isOwner: boolean;
}

function StoreLayout({ user, products, isLoading, isOwner }: StoreLayout) {
  
  if (isLoading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  
  if (!user) return <div className="h-screen flex items-center justify-center">Usuário não encontrado.</div>;

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:24px_24px]">
        <Header />

        <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-12">
          <Sidebar data={user} isOwner={isOwner} />
          <Showcase products={products} isOwner={isOwner}  />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default StoreLayout;


