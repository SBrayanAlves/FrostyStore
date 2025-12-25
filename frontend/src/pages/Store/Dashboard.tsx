import { useEffect, useState } from 'react';
import api from '../../services/Api';
import StoreLayout from '../../layout/StoreLayout';
import type { User } from '../../Types/User';
import type { Product } from "../../Types/Product";

function Dashboard() {
  const [me, setMe] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    Promise.all([
      api.get('auth/dashboard/'),
      api.get('catalog/products/')
    ])
    .then(([userRes, productRes]) => {
        setMe(userRes.data);
        setProducts(productRes.data);
    })
    .catch(err => {
      console.error("Erro ao carregar loja:", err);
    })
    .finally(() => setLoading(false));
    }, []);


  return (
    <StoreLayout
      user={me}
      products={products}
      isLoading={loading} 
      isOwner={true}
    />
  )
}

export default Dashboard