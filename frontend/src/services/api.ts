import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Não autorizado) e não for uma tentativa de refresh que falhou
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca que já tentamos reenviar para evitar loop infinito

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        
        // Se não tiver refresh token, não tem o que fazer, manda pro login
        if (!refreshToken) {
            throw new Error("No refresh token");
        }

        // Chama a rota de refresh do Django para pegar um novo access token
        const response = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // Salva o novo token
        localStorage.setItem("access_token", newAccessToken);

        // Atualiza o header da requisição que falhou com o novo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Tenta fazer a requisição original novamente
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar (o refresh token também expirou), desloga o usuário
        console.error("Sessão expirada. Faça login novamente.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redireciona para o login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;