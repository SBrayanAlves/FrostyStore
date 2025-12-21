import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Logout() {
    
    const acessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogout = async () => {
        try {
            await api.post("http://127.0.0.1:8000/api/auth/logout/", { refresh: refreshToken }, {
                headers: {
                    Authorization: `Bearer ${acessToken}`,
                },
            });
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            navigate("/login");
        } catch (error) {
            setError("Logout failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Logout</h2>
            {error && <p>{error}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;