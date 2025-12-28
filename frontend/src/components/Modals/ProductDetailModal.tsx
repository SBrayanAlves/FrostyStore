import { useEffect, useState } from 'react';
import api from '../../services/Api';
// 1. Correção do Import para bater com o arquivo criado acima
import type { DetailsProduct } from '../../Types/DetailsProduct'; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string | null;
}

export default function ProductDetailModal({ isOpen, onClose, productSlug }: ModalProps) {
  // 2. Uso da tipagem correta
  const [product, setProduct] = useState<DetailsProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Estado para evitar tela branca
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (isOpen && productSlug) {
      setLoading(true);
      setError(null);

      // Verifique se sua API precisa da barra final "/" ou não
      api.get(`catalog/products/${productSlug}/`)
        .then(res => {
            setProduct(res.data);
            setCurrentImgIndex(0);
        })
        .catch(err => {
            console.error("Erro ao carregar produto", err);
            setError("Não foi possível carregar os detalhes deste produto.");
        })
        .finally(() => setLoading(false));
    } else {
        setProduct(null);
        setError(null);
    }
  }, [isOpen, productSlug]);

  const nextImage = () => {
    if (!product?.images) return;
    setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setCurrentImgIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Card Modal */}
      <div className="bg-white w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 animate-zoom-in">
        
        {/* Botão Fechar Mobile */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center md:hidden">
            <i className="fa-solid fa-times"></i>
        </button>

        {/* --- ESTADOS DE RENDERIZAÇÃO --- */}

        {/* 1. Loading */}
        {loading && (
           <div className="w-full h-full flex items-center justify-center bg-white flex-col gap-2">
              <i className="fa-solid fa-circle-notch fa-spin text-4xl text-brand-500"></i>
              <span className="text-slate-400 text-sm">Carregando...</span>
           </div>
        )}

        {/* 2. Erro (Evita a tela branca) */}
        {!loading && error && (
           <div className="w-full h-full flex items-center justify-center bg-white flex-col gap-4 p-8 text-center">
              <i className="fa-solid fa-circle-exclamation text-4xl text-red-400"></i>
              <p className="text-slate-600">{error}</p>
              <button onClick={onClose} className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 text-slate-700">Fechar</button>
           </div>
        )}

        {/* 3. Conteúdo (Só renderiza se tiver produto e não estiver carregando) */}
        {!loading && !error && product && (
          <>
            {/* ESQUERDA: FOTOS */}
            <div className="w-full md:w-[60%] h-[40vh] md:h-full bg-slate-100 relative group select-none flex items-center justify-center">
                
                {product.images && product.images.length > 0 ? (
                    <img 
                        // AQUI O ERRO FOI CORRIGIDO (Tipagem agora aceita .image)
                        src={product.images[currentImgIndex].image} 
                        className="max-w-full max-h-full object-contain mix-blend-multiply" 
                        alt={product.name}
                    />
                ) : (
                    <div className="text-slate-400 flex flex-col items-center gap-2">
                        <i className="fa-regular fa-image text-3xl"></i>
                        Sem imagem
                    </div>
                )}

                {/* Setas de Navegação */}
                {product.images && product.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                        {/* Indicadores */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {product.images.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full shadow-sm transition-all ${idx === currentImgIndex ? 'bg-brand-500 scale-125' : 'bg-slate-300'}`}></div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* DIREITA: INFORMAÇÕES */}
            <div className="w-full md:w-[40%] h-full flex flex-col bg-white border-l border-slate-100">

                {/* Header Vendedor */}
                <div className="h-16 shrink-0 border-b border-slate-100 flex items-center justify-between px-6 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold border border-brand-200">
                             {product.seller_name ? product.seller_name.charAt(0).toUpperCase() : 'V'}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-none">{product.seller_name}</h3>
                            <span className="text-xs text-slate-500">Vendedor Verificado</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-slate-900 transition-colors">
                        <i className="fa-solid fa-times text-lg"></i>
                    </button>
                </div>

                {/* Conteúdo Scrollável */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-3 uppercase tracking-wider">
                        <span className="bg-brand-50 px-2 py-1 rounded-md">{product.category_name}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{product.name}</h1>
                    
                    <div className="flex items-baseline gap-2 mb-6 border-b border-slate-50 pb-6">
                        <span className="text-3xl font-light text-slate-900">
                            R$ {Math.floor(Number(product.price)).toLocaleString('pt-BR')}
                            <small className="text-lg font-normal text-slate-500">,{(Number(product.price) % 1).toFixed(2).substring(2)}</small>
                        </span>
                    </div>

                    {/* Chips de Especificação */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="fa-solid fa-bolt"></i></div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Voltagem</p>
                                <p className="text-sm font-semibold text-slate-700">{product.voltage}</p>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="fa-solid fa-tag"></i></div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Marca</p>
                                <p className="text-sm font-semibold text-slate-700">{product.brand_name}</p>
                            </div>
                        </div>
                         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm"><i className="fa-regular fa-star"></i></div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Condição</p>
                                <p className="text-sm font-semibold text-slate-700">{product.condition}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900">Sobre este item</h3>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                            {product.description || "Sem descrição disponível."}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2">
                        <i className="fa-brands fa-whatsapp text-lg"></i>
                        Tenho Interesse
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                        <i className="fa-solid fa-shield-halved"></i> Negociação segura via FrostyStore
                    </p>
                </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}