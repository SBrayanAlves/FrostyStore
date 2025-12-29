import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import api from '../../services/Api';
import StoreLayout from '../../layout/StoreLayout';
import type { Seller } from '../../Types/Seller';
import type { Product } from "../../Types/Product";
import ProductDetailModal from '../../components/Modals/ProductDetailModal';

function PublicStore() {

  const { slugProduct } = useParams();
  const navigate = useNavigate();

  const { slug } = useParams();
  const [user, setUser] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isModalOpen = !!slugProduct;

  useEffect(() => {
    if (!slug) return;

    const cleanSlug = slug.toLowerCase();
    
    Promise.all([
        api.get(`auth/${cleanSlug}`), 

        api.get(`catalog/products/${cleanSlug}`) 
    ])
    .then(([userRes, productRes]) => {
      const productList = productRes.data.results || productRes.data;
          setProducts(productList);
        setUser(userRes.data);
    })
    .catch(err => {
        console.error("Erro ao carregar loja:", err);
    })
    .finally(() => setLoading(false));

  }, [slug]);

  const handleCloseModal = () => {
    navigate(`/${slug}`);
  };

  return (
    <>
      <StoreLayout
        user={user} 
        products={products}
        isLoading={loading} 
        isOwner={false}
      />

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productSlug={slugProduct || null}
        isOwner={false}
      />
    </>
  );
}

export default PublicStore;