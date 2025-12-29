import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from "../../Types/Product";

interface ShowcaseProps {
  products: Product[];
  isOwner: boolean;
}

function Showcase({ products, isOwner }: ShowcaseProps) {
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleOpenProduct = (productSlug: string) => {
    if (isOwner) {
      navigate(`/dashboard/p/${productSlug}`);
    } else {
      navigate(`/${slug}/p/${productSlug}`);
    }
  };

  // Tag de Condição (Novo, Usado) - Aparece para TODOS
  const getProductTag = (condition: string) => {
    switch (condition) {
        case 'Novo':
            return { text: 'NOVO', color: 'bg-emerald-500' };
        case 'Semi-novo':
            return { text: 'SEMI-NOVO', color: 'bg-blue-500' };
        case 'Usado-Excelente':
            return { text: 'EXCELENTE', color: 'bg-blue-600' };
        case 'Usado-Bom': 
            return { text: 'BOM ESTADO', color: 'bg-indigo-500' };
        case 'Recondicionado':
            return { text: 'RECONDICIONADO', color: 'bg-orange-500' };
        default:
            return null;
    }
  };

  // Tag de Status (Ativo/Inativo) - Só será chamada se isOwner for true
  const getProductStatus = (active: boolean) => {
    return active 
        ? { text: 'ATIVO', color: 'bg-green-500', icon: 'fa-check' }
        : { text: 'INATIVO', color: 'bg-red-500', icon: 'fa-ban' };
  };

  const getCoverImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
        const imgUrl = product.images[0].image;
        // Validação para evitar urls duplicadas (http://localhost...)
        if (imgUrl.startsWith('http')) {
            return imgUrl;
        }
        return `http://localhost:8000${imgUrl}`;
    }
    return "https://placehold.co/400x400?text=Sem+Imagem";
  };

  return (
    <section className="flex-1 min-w-0 animate-fade-in">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isOwner ? "Gerenciar Produtos" : "Vitrine de Produtos"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isOwner 
                ? `Você tem ${products.length} produtos cadastrados.` 
                : "Confira as melhores ofertas selecionadas."}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300 text-2xl">
                <i className="fa-solid fa-box-open"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Nenhum produto encontrado</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                {isOwner 
                    ? "Comece adicionando seu primeiro produto clicando em 'Criar Anúncio'." 
                    : "Este vendedor ainda não publicou nenhum produto."}
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
            
            const conditionTag = getProductTag(product.condition);
            
            // --- LÓGICA DE SEGURANÇA VISUAL ---
            // Se isOwner for falso, statusTag será null e não renderizará nada
            const statusTag = isOwner ? getProductStatus(product.active ?? false) : null;
            
            const priceNumber = Number(product.price);

            return (
                <div 
                    key={product.id} 
                    // Se for dono e estiver inativo, deixa o card meio transparente
                    className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                        ${!product.active && isOwner ? 'border-red-100 opacity-90' : 'border-slate-100 hover:border-brand-100'}
                    `}
                >
                
                <div className="relative h-60 overflow-hidden bg-slate-50">
                    
                    {/* TAG DE CONDIÇÃO (Sempre visível) */}
                    {conditionTag && (
                        <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 tracking-wide ${conditionTag.color}`}>
                            {conditionTag.text}
                        </span>
                    )}

                    {/* TAG DE STATUS (Visível APENAS se statusTag != null, ou seja, se isOwner=true) */}
                    {statusTag && (
                        <span className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 flex items-center gap-1.5 ${statusTag.color}`}>
                            <i className={`fa-solid ${statusTag.icon}`}></i>
                            {statusTag.text}
                        </span>
                    )}
                    
                    <img
                        src={getCoverImage(product)}
                        alt={product.name}
                        className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 
                            ${!product.active && isOwner ? 'grayscale' : ''} 
                        `}
                    />
                    
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button 
                            onClick={() => handleOpenProduct(product.slug)}
                            className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm shadow-xl hover:bg-brand-50 transition-colors flex items-center gap-2"
                        >
                            {isOwner ? (
                                <><i className="fa-solid fa-pen-to-square"></i> Gerenciar</>
                            ) : (
                                <><i className="fa-solid fa-eye"></i> Ver Detalhes</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-5 flex flex-col h-[170px]">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {product.brand_name || 'Genérico'}
                        </p>

                        <h3 
                            onClick={() => handleOpenProduct(product.slug)}
                            className="font-bold text-slate-800 text-lg leading-snug mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 cursor-pointer"
                            title={product.name}
                        >
                            {product.name}
                        </h3>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-end justify-between mt-auto">
                        <div>
                            <span className="block text-xs text-slate-400 font-medium mb-0.5">Preço à vista</span>
                            <span className="text-xl font-bold text-slate-900">
                                R$ {Math.floor(priceNumber).toLocaleString('pt-BR')}
                                <small className="text-sm font-semibold text-slate-500">
                                    ,{(priceNumber % 1).toFixed(2).substring(2)}
                                </small>
                            </span>
                        </div>
                        
                        <button 
                            onClick={() => handleOpenProduct(product.slug)}
                            className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all hover:scale-110 shadow-sm"
                            title={isOwner ? "Editar" : "Ver detalhes"}
                        >
                            <i className={`fa-solid ${isOwner ? 'fa-pen' : 'fa-arrow-right'}`}></i> 
                        </button>
                    </div>
                </div>
                </div>
            );
            })}
        </div>
      )}
    </section>
  );
}

export default Showcase;