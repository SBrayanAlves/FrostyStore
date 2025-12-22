
import { useEffect, useState } from 'react';
import api from '../services/api';
import StoreLayout from '../layout/StoreLayout';

function Dashboard() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('http://localhost:8000/api/auth/me/')
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