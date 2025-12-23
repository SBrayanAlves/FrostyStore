import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import StoreLayout from '../layout/StoreLayout';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  bio: string;
}

function PublicStore() {
  const { slug } = useParams();
  const [user, setUser] = useState<User | null>(null);
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