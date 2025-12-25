import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/Api';
import StoreLayout from '../../layout/StoreLayout';
import type { Seller } from '../../Types/Seller';
import type { Product } from "../../Types/Product";

function PublicStore() {
  const { slug } = useParams();
  const [user, setUser] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const cleanSlug = slug.toLowerCase();
    
    Promise.all([
        api.get(`auth/${cleanSlug}`), 

        api.get(`catalog/products/${cleanSlug}`) 
    ])
    .then(([userRes, productRes]) => {
        setUser(userRes.data);
        setProducts(productRes.data);
    })
    .catch(err => {
        console.error("Erro ao carregar loja:", err);
    })
    .finally(() => setLoading(false));

  }, [slug]);

  return (
    <StoreLayout
      user={user} 
      products={products}
      isLoading={loading} 
      isOwner={false}
    />
  );
}

export default PublicStore;