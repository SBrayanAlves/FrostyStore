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

  const isModalOpen = !!slugProduct;

  useEffect(() => {
    
    Promise.all([
      api.get('auth/dashboard/'),
      api.get('catalog/products/')
    ])
    .then(([userRes, productRes]) => {
        setMe(userRes.data);
        
        // --- CORREÇÃO AQUI ---
        // Verifica se veio paginado (.results) ou lista pura
        const productList = productRes.data.results || productRes.data; 
        setProducts(productList);
    })
    .catch(err => {
      console.error("Erro ao carregar loja:", err);
    })
    .finally(() => setLoading(false));
    }, []);

  const handleCloseModal = () => {
    navigate(`/dashboard`);
  };

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

export default Dashboard