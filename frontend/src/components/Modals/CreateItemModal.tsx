import { useState, useRef } from 'react';
import api from '../../services/Api';
import { toast } from 'react-toastify';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateProductModal({ isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState(1); // 1: Dados, 2: Fotos, 3: Sucesso
  const [loading, setLoading] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  // Dados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '', 
    brand: '',
    voltage: '110V', // Valor padrão deve bater com models.py
    condition: 'Novo', // Valor padrão deve bater com models.py
  });

  // Imagens
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  // --- LÓGICA DE ENVIO ---
  
  // Passo 1: Criar Rascunho
  const handleStep1Submit = async () => {
    // Validação básica
    if (!formData.name || !formData.price) return toast.success("Preencha nome e preço.");
    if (!formData.category || !formData.brand) return toast.success("Selecione a categoria e a marca.");

    try {
      setLoading(true);
      // POST: Cria o produto (active=False por padrão no backend)
      const response = await api.post('catalog/products/create/', formData);
      setCreatedProductId(response.data.id);
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.success("Erro ao salvar dados. Verifique se os campos estão corretos.");
    } finally {
      setLoading(false);
    }
  };

  // Passo 2: Enviar Fotos e Publicar
  const handleStep2Submit = async () => {
    if (!createdProductId) return;
    
    try {
      setLoading(true);
      
      // 1. Enviar Imagens (uma por uma)
      for (const image of selectedImages) {
        const data = new FormData();
        data.append('product', createdProductId);
        data.append('image', image);
        
        // POST: Upload da imagem
        await api.post('catalog/products/images/upload/', data, { 
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // 2. Publicar (Ativar o produto)
      // PATCH: Edita o produto para active=True usando o UUID criado
      await api.patch(`catalog/products/edit/${createdProductId}/`, { active: true });
      
      setStep(3); // Sucesso
    } catch (error) {
      console.error(error);
      toast.success("Erro ao enviar imagens ou publicar.");
    } finally {
      setLoading(false);
    }
  };

  // Fechar e Resetar
  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setStep(1);
        setFormData({ name: '', price: '', description: '', category: '', brand: '', voltage: '110V', condition: 'Novo' });
        setSelectedImages([]);
        setPreviewUrls([]);
        setCreatedProductId(null);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        
        {/* HEADER */}
        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-5 bg-white sticky top-0 z-20">
          <button onClick={handleClose} className="text-red-500 font-medium text-sm hover:text-red-600">
             {step === 1 ? 'Cancelar' : 'Fechar'}
          </button>
          
          <span className="font-bold text-slate-800 tracking-tight">
            {step === 1 && "Novo Anúncio"}
            {step === 2 && "Adicionar Fotos"}
            {step === 3 && "Concluído"}
          </span>
          
          <div>
            {step === 1 && (
                <button onClick={handleStep1Submit} disabled={loading} className="text-brand-600 font-bold text-sm hover:text-brand-700 disabled:opacity-50">
                    {loading ? 'Salvando...' : 'Avançar'}
                </button>
            )}
            {step === 2 && (
                <button onClick={handleStep2Submit} disabled={loading} className="text-brand-600 font-bold text-sm hover:text-brand-700 disabled:opacity-50">
                    {loading ? 'Publicando...' : 'Publicar'}
                </button>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar bg-white relative">
          
          {/* STEP 1: DADOS */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome do Produto</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium" placeholder="Ex: Geladeira Brastemp" />
              </div>

              {/* Preço e Categoria */}
              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preço (R$)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium" placeholder="0.00" />
                 </div>
                 
                 {/* Select de Categoria (UUIDs) */}
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categoria</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none">
                        <option value="">Selecione...</option>
                        <option value="d353d83a-775d-4250-a154-3fbb4e2a6626">Geladeira Inox</option>
                        <option value="b9af6348-febb-455b-84a7-d9e56642ab0e">Geladeira Inverse</option>
                        <option value="574b9512-a509-4986-8c29-304aec5332a5">Geladeira Branca</option>
                        <option value="f3f2e566-5464-41dc-b274-523e29e06eda">Freezer Horizontal</option>
                        <option value="d68ec895-5a46-4b78-b17f-03163b267897">Freezer Vertical</option>
                        <option value="d68ec895-5a46-4b78-b17f-03163b267897">Cervejeiro</option>
                        <option value="cd627815-2fca-4a22-9b97-3c6a0c9536c9">Frigobar</option>
                        <option value="091bd359-37f2-48b6-af0c-9dfa8d787e1e">Maquina de Lavar e Secadora</option>

                    </select>
                 </div>
              </div>
              
               {/* Marca, Voltagem e Condição */}
               <div className="grid grid-cols-3 gap-4">
                    {/* Select de Marca (UUIDs) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Marca</label>
                        <select name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none">
                            <option value="">Selecione...</option>
                            <option value="aa4c6147-a857-44fc-8c0c-7f82a8fcea6b">Ártico</option>
                            <option value="a11f8083-6edb-4726-993b-91a28ca0b4e2">Black+Decker</option>
                            <option value="ed273e1f-857c-4d8e-898b-17103ac55e56">Brastemp</option> 
                            <option value="fc5de96f-f9f1-4cc6-b8a4-584feb6b1562">Britânia</option>
                            <option value="d6b92300-8e57-4634-94d0-46c7d7ec0489">Conservex</option>
                            <option value="2f032c4b-8ac9-4061-afd3-e1439e12506d">Consul</option>
                            <option value="2bf4a3dd-135a-4104-8171-48687af29a24">Continental</option>
                            <option value="ff3e0d67-f28b-4a88-ad44-d89dec334100">Dako</option>
                            <option value="cd896cda-1d40-462b-973d-d81d5fb63133">EOS</option>
                            <option value="9fe92294-dd8b-45fc-b50f-a17e595af50a">Esmaltec</option>
                            <option value="a052609d-f500-4411-b033-b900fd417a47">EVOL</option>
                            <option value="badc9b2d-62f4-4093-8a11-63bfeeda02ae">Hisense</option>
                            <option value="0f83e349-1c50-490c-ac43-744edc5b69a9">LG</option>
                            <option value="b8c4c855-9fb2-4250-9906-ed078600611f">Midea</option>
                            <option value="7362eeea-7c88-4b79-9d29-092f151ae732">Panasonic</option>
                            <option value="8f968add-b24a-4972-91c7-540a47143432">Philco</option>
                            <option value="67f4cc76-b180-45f4-b2fd-b5942dc2d22a">Samsung</option>
                            <option value="4b47db32-3200-4f39-96d4-c16a8ed5ecc4">Electrolux</option>
                            <option value="f2d8fcb2-5b0d-4697-becf-18b958d130bf">Outro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Voltagem</label>
                        <select name="voltage" value={formData.voltage} onChange={handleChange} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none">
                            <option value="110V">110V</option>
                            <option value="220V">220V</option>
                            <option value="Bivolt">Bivolt</option>
                        </select>
                    </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Condição</label>
                        <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none">
                            <option value="Novo">Novo</option>
                            <option value="Semi-novo">Semi-novo</option>
                            <option value="Usado-Excelente">Usado (Excelente)</option>
                            <option value="Usado-Bom">Usado (Bom)</option>
                            <option value="Recondicionado">Recondicionado</option>
                            <option value="Defeituoso">Defeituoso</option>
                        </select>
                    </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descrição</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none font-medium" placeholder="Detalhes do produto..."></textarea>
              </div>
            </div>
          )}

          {/* STEP 2: FOTOS */}
          {step === 2 && (
            <div className="flex flex-col items-center animate-fade-in">
              {previewUrls.length === 0 ? (
                  <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-brand-50/50 hover:border-brand-300 transition-all cursor-pointer p-10 text-center group">
                     <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-brand-500 text-3xl group-hover:scale-110 transition-transform">
                        <i className="fa-regular fa-images"></i>
                     </div>
                     <h3 className="text-slate-900 font-bold text-lg">Selecionar Fotos</h3>
                  </div>
              ) : (
                  <div className="grid grid-cols-3 gap-3 w-full">
                      {previewUrls.map((url, idx) => (
                          <div key={idx} className="aspect-square rounded-xl overflow-hidden relative">
                              <img src={url} className="w-full h-full object-cover" />
                          </div>
                      ))}
                        <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-brand-500 cursor-pointer">
                           <i className="fa-solid fa-plus text-xl"></i>
                        </div>
                  </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleImageSelect} />
            </div>
          )}

          {/* STEP 3: SUCESSO */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center animate-fade-in">
               <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mb-6 animate-bounce">
                  <i className="fa-solid fa-check"></i>
               </div>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">Sucesso!</h2>
               <p className="text-slate-500 mb-8">Produto publicado na vitrine.</p>
               <button onClick={handleClose} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Voltar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateProductModal;