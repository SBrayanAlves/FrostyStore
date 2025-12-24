import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/Api';
import StoreLayout from '../../layout/StoreLayout';
import type { Seller } from '../../Types/Seller';

function PublicStore() {
  const { slug } = useParams();
  const [user, setUser] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const cleanSlug = slug.toLowerCase();
    console.log("Buscando usuário:", cleanSlug)

    api.get(`auth/${cleanSlug}`) 
      .then(res => {
        console.log("Usuário encontrado:", res.data);
        setUser(res.data);
      })
      .catch(err => {
        console.error("Erro API:", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <StoreLayout
      user={user} 
      isLoading={loading} 
      isOwner={false}
    />
  );
}

export default PublicStore;