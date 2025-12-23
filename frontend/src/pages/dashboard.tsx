
import { useEffect, useState } from 'react';
import api from '../services/api';
import StoreLayout from '../layout/StoreLayout';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  bio: string;
  date_of_birth: string | null;
  location: string | null;
  phone_number: string | null;
  email: string;
}

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