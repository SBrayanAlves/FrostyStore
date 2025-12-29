import { useState, type ChangeEvent, type FormEvent } from "react";
import type { User } from "../../Types/User";
import api from "../../services/Api";
import { toast } from 'react-toastify';

interface UserPerfilProps {
  user: User;
}

const BASE_URL = "http://localhost:8000";

function PerfilScreen({ user }: UserPerfilProps) {
  
  // 1. ESTADOS: Guardam os valores dos inputs
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    bio: user.bio || "",
    date_of_birth: user.date_of_birth || "",
    phone_number: user.phone_number || "",
    location: user.location || "",
  });

  // Estado separado para a imagem (Arquivo e Preview)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Função auxiliar para montar a URL da imagem
  const getAvatarUrl = (path: string | null) => {
    if (preview) return preview; // Se o usuário selecionou uma nova, mostra o preview
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
  };

  // 2. HANDLER DE TEXTO: Atualiza o estado quando o usuário digita
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 3. HANDLER DE ARQUIVO: Pega a imagem e cria um preview instantâneo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Cria URL temporária para mostrar a foto na hora
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // 4. SUBMIT: Envia os dados para a API (Igual ao Insomnia Multipart)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // <--- O PULO DO GATO: Impede a tela de piscar/recarregar
    setIsSaving(true);

    try {
      const dataToSend = new FormData();

      // Adiciona os campos de texto
      dataToSend.append("first_name", formData.first_name);
      dataToSend.append("last_name", formData.last_name);
      dataToSend.append("bio", formData.bio);
      dataToSend.append("location", formData.location);
      
      // Só manda data e telefone se tiver valor (evita erro de formato no backend)
      if (formData.date_of_birth) dataToSend.append("date_of_birth", formData.date_of_birth);
      if (formData.phone_number) dataToSend.append("phone_number", formData.phone_number);

      // Adiciona a imagem SE o usuário tiver selecionado uma nova
      if (selectedFile) {
        dataToSend.append("profile_picture", selectedFile);
      }

      // Envia para o backend (usando PATCH para atualização parcial)
      await api.patch("auth/dashboard/me/edit/", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Importante para envio de arquivos
        },
      });

      window.location.reload(); // Opcional: Recarrega para garantir dados frescos
      
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.success("Erro ao salvar alterações. Verifique os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Perfil</h1>
          <p className="text-sm text-slate-500 mt-1">
            Atualize suas informações pessoais e públicas.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Adicionado onSubmit */}
        <form onSubmit={handleSubmit}> 
          
          <div className="mb-8 border-b border-slate-100 pb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Foto de Perfil
            </label>
            <div className="flex items-center gap-6">
              <div className="shrink-0">
                <img
                  className="h-20 w-20 object-cover rounded-full border border-slate-200"
                  src={getAvatarUrl(user.profile_picture) || "/default_avatar.png"}
                  alt="Foto atual"
                />
              </div>
              <label className="block">
                <span className="sr-only">Escolher foto de perfil</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg" // Filtra apenas imagens
                  onChange={handleFileChange} // Handler de arquivo
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
                />
                <p className="mt-2 text-xs text-slate-400">
                  JPG ou PNG. Máximo de 2MB.
                </p>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-slate-700">
                Nome
              </label>
              <input
                type="text"
                id="first_name"
                value={formData.first_name} // Controlled Component
                onChange={handleInputChange} // Handler de texto
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-slate-700">
                Sobrenome
              </label>
              <input
                type="text"
                id="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none transition-colors"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-slate-700">
                Nome de Usuário (@)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-slate-400">@</span>
                </div>
                <input
                  type="text"
                  id="username"
                  defaultValue={user.username}
                  disabled
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full pl-8 p-2.5 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bio" className="block mb-2 text-sm font-medium text-slate-700">
                Biografia
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors resize-none"
              ></textarea>
              <p className="mt-1 text-xs text-slate-400 text-right">
                {formData.bio.length}/300 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block mb-2 text-sm font-medium text-slate-700">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-slate-700">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fa-solid fa-phone text-slate-400 text-xs"></i>
                </div>
                <input
                  type="tel"
                  id="phone_number" // ID CORRIGIDO para bater com o state e backend
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full pl-8 p-2.5 outline-none transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="location" className="block mb-2 text-sm font-medium text-slate-700">
                Localização
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fa-solid fa-location-dot text-slate-400 text-xs"></i>
                </div>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full pl-8 p-2.5 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                defaultValue={user.email}
                disabled
                className="bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            {/* Botão Cancelar volta para dashboard apenas visualmente se usar Link, ou volta histórico */}
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>Salvando...</>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PerfilScreen;