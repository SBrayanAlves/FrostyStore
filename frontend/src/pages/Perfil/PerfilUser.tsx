import { useEffect, useState } from "react";
import api from "../../services/api";
import PerfilLayout from "../../layout/PerfilLayout";
import type { User } from "../../Types/User";

function PerfilUser() {
    const [me, setMe] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('auth/dashboard/me/')
            .then(res => setMe(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }
    , []);

    return (
        <PerfilLayout
            user={me}
            isLoading={loading}
            isOwner={true}
        />
    )
}

export default PerfilUser