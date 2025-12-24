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

export type { User };