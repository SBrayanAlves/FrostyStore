import { useEffect, useState } from 'react';
import api from '../../services/Api';
import StoreLayout from '../../layout/StoreLayout';
import type { User } from '../../Types/User';

function Dashboard() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('auth/dashboard/')
      .then(res => setMe(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StoreLayout
      user={me} 
      isLoading={loading} 
      isOwner={true}
    />
  )
}

export default Dashboard