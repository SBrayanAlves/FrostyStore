import { useState, useEffect } from 'react';
import api from '../../services/Api';
import type { DetailsProduct } from '../../Types/DetailsProduct';
import { toast } from 'react-toastify';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DetailsProduct;
  onSuccess: (updatedProduct: DetailsProduct) => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    condition: '',
    voltage: '',
    active: true // Novo campo
  });

  // Preenche o formulário quando o modal abre ou o produto muda
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name,
        price: String(product.price),
        description: product.description || '',
        condition: product.condition,
        voltage: product.voltage,
        active: product.active // Pega o status atual (true/false)
      });
    }
  }, [isOpen, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função específica para alternar o Toggle (Ativo/Inativo)
  const toggleActive = () => {
    setFormData(prev => ({ ...prev, active: !prev.active }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await api.patch(`catalog/products/edit/${product.id}/`, formData);
        
        toast.success("Produto atualizado com sucesso!");
        onSuccess(response.data);
        onClose();
        
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        toast.success("Erro ao salvar alterações. Verifique os dados e tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Z-INDEX 150: Garante que fique SOBRE o ProductDetailModal
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
      
      {/* Backdrop Escuro */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Card do Modal */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative z-20 overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
            <button 
                onClick={onClose} 
                className="text-slate-500 hover:text-slate-800 font-medium text-sm px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
                type="button"
            >
                Cancelar
            </button>
            
            <h3 className="font-bold text-slate-800 text-base">Editar Informações</h3>
            
            <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="text-brand-600 hover:text-brand-700 font-bold text-sm px-2 py-1 rounded-md hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
            >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Concluir'}
            </button>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* --- NOVO TOGGLE DE ATIVO/INATIVO --- */}
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${formData.active ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex flex-col">
                    <span className={`text-sm font-bold ${formData.active ? 'text-green-700' : 'text-slate-600'}`}>
                        {formData.active ? 'Anúncio Ativo' : 'Anúncio Pausado'}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                        {formData.active 
                            ? 'O produto está visível na sua loja.' 
                            : 'O produto está oculto para clientes.'}
                    </span>
                </div>

                {/* Switch Button (Toggle) */}
                <button
                    type="button"
                    onClick={toggleActive}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        formData.active ? 'bg-green-500 focus:ring-green-500' : 'bg-slate-300 focus:ring-slate-400'
                    }`}
                >
                    <span
                        className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ease-in-out transform ${
                            formData.active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
            {/* ------------------------------------- */}

            {/* Nome do Produto */}
            <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Título do Anúncio</label>
                <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-b border-slate-200 py-2 text-lg text-slate-900 font-medium focus:border-brand-500 focus:outline-none transition-colors bg-transparent placeholder:text-slate-300"
                    placeholder="Ex: Geladeira Brastemp"
                />
            </div>

            {/* Grid Preço e Voltagem */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Preço (R$)</label>
                    <input 
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border-b border-slate-200 py-2 text-lg text-slate-900 font-medium focus:border-brand-500 focus:outline-none transition-colors bg-transparent"
                        placeholder="0,00"
                    />
                </div>
                
                <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Voltagem</label>
                    <select 
                        name="voltage"
                        value={formData.voltage}
                        onChange={handleChange}
                        className="w-full border-b border-slate-200 py-2 text-base text-slate-900 font-medium focus:border-brand-500 focus:outline-none bg-transparent cursor-pointer"
                    >
                        <option value="" disabled>Selecione</option>
                        <option value="110v">110v</option>
                        <option value="220v">220v</option>
                        <option value="Bivolt">Bivolt</option>
                    </select>
                </div>
            </div>

            {/* Condição */}
            <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Condição</label>
                <select 
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full border-b border-slate-200 py-2 text-base text-slate-900 font-medium focus:border-brand-500 focus:outline-none bg-transparent cursor-pointer"
                >
                    <option value="" disabled>Selecione a condição</option>
                    <option value="Novo">Novo (Lacrado)</option>
                    <option value="Semi-novo">Semi-novo</option>
                    <option value="Usado-Excelente">Usado - Excelente Estado</option>
                    <option value="Usado-Bom">Usado - Bom Estado</option>
                    <option value="Recondicionado">Recondicionado</option>
                    <option value="Defeituoso">Defeituoso</option>
                </select>
            </div>

            {/* Descrição */}
            <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Descrição Detalhada</label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300 transition-all resize-none"
                    placeholder="Descreva detalhes..."
                />
            </div>
            
            {/* Aviso de Imagem */}
            <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex items-start gap-2">
                <i className="fa-solid fa-circle-info mt-0.5"></i>
                <p>Para alterar as fotos do produto, utilize a opção "Gerenciar Fotos" na tela anterior.</p>
            </div>

        </div>
      </div>
    </div>
  );
}