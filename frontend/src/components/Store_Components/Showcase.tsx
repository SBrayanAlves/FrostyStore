import type { Product } from "../../Types/Product";

interface ShowcaseProps {
  products: Product[];
}


function Showcase({ products }: ShowcaseProps) {

  const getProductTag = (condition: string) => {
    switch (condition) {
        case 'Novo':
            return { text: 'NOVO', color: 'bg-green-500' };
        case 'Semi-novo':
        case 'Usado-Excelente':
            return { text: 'EXCELENTE', color: 'bg-blue-500' };
        case 'Recondicionado':
            return { text: 'RECONDICIONADO', color: 'bg-orange-500' };
        default:
            return null;
    }
  };

  const getCoverImage = (product: Product) => {
    // Verifica se existe o array e se tem itens dentro
    if (product.images && product.images.length > 0) {
        // Acessa a propriedade .image do primeiro objeto
        const imgUrl = product.images[0].image;
        
        // DICA: Se o Django retornar apenas "/media/...", você pode precisar concatenar a URL base da API
        // Exemplo: return `http://localhost:8000${imgUrl}`;
        // Se já vier completa, deixe assim:
        return `http://localhost:8000${imgUrl}`; 
    }
    // Placeholder
    return "https://placehold.co/400x400?text=Sem+Imagem";
  };

  return (
    <section className="flex-1 min-w-0">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vitrine de Produtos</h1>
          <p className="text-sm text-slate-500 mt-1">Confira as melhores ofertas selecionadas.</p>
        </div>
        <button className="text-sm font-medium text-slate-600 hover:text-brand-600 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
          <i className="fa-solid fa-arrow-down-short-wide"></i> Ordenar
        </button>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500">Este vendedor ainda não publicou produtos.</p>
        </div>
      ) : (
        /* Grid de Produtos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
            
            const tag = getProductTag(product.condition);
            // Convertendo a string "2500.00" para numero
            const priceNumber = Number(product.price);

            return (
                <div key={product.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
                
                {/* Imagem Container */}
                <div className="relative h-56 overflow-hidden bg-slate-50">
                    {tag && (
                    <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 ${tag.color}`}>
                        {tag.text}
                    </span>
                    )}
                    
                    <img
                    src={getCoverImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Botão Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Ver Detalhes
                    </button>
                    </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5">
                    <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {product.name}
                    </h3>
                    
                    {/* Exibe Marca e Condição */}
                    <p className="text-xs text-slate-400 mb-4">
                        {product.brand_name} • {product.condition}
                    </p>

                    <div className="flex items-end justify-between">
                    <div>
                        <span className="text-xl font-bold text-slate-900">
                        R$ {Math.floor(priceNumber).toLocaleString('pt-BR')}
                        <small className="text-sm font-normal">
                            ,{(priceNumber % 1).toFixed(2).substring(2)}
                        </small>
                        </span>
                    </div>
                    
                    <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                        <i className="fa-solid fa-cart-shopping"></i>
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