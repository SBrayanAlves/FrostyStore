import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import api from '../../services/Api';
import StoreLayout from '../../layout/StoreLayout';
import type { User } from '../../Types/User';
import type { Product } from "../../Types/Product";
import ProductDetailModal from '../../components/Modals/ProductDetailModal';

function Dashboard() {

  const { slugProduct } = useParams();
  const navigate = useNavigate();

  const [me, setMe] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const isModalOpen = !!slugProduct;

  // Função para carregar os dados (usada no useEffect e no botão de erro)
  const loadData = () => {
    setLoading(true);
    setError(false);

    Promise.all([
      api.get('auth/dashboard/'),
      api.get('catalog/products/')
    ])
    .then(([userRes, productRes]) => {
        setMe(userRes.data);
        
        // Verifica se veio paginado (.results) ou lista pura
        const productList = productRes.data.results || productRes.data; 
        setProducts(productList);
    })
    .catch(err => {
      console.error("Erro ao carregar loja:", err);
      setError(true); // Ativa a tela de erro
    })
    .finally(() => setLoading(false));
  };

  // Chama a função ao carregar o componente
  useEffect(() => {
    loadData();
  }, []);

  const handleCloseModal = () => {
    navigate(`/dashboard`);
  };

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mb-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ops! Algo deu errado.</h2>
        <p className="text-slate-500 text-center max-w-md">
            Não foi possível carregar seus produtos. Verifique sua conexão ou se o servidor está ativo.
        </p>
        <button 
            onClick={loadData}
            className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium flex items-center gap-2"
        >
            <i className="fa-solid fa-rotate-right"></i> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <StoreLayout
        user={me}
        products={products}
        isLoading={loading} 
        isOwner={true}
      />

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productSlug={slugProduct || null}
        isOwner={true}
      />
    </>
  )
}

export default Dashboard;