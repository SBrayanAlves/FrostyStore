// Interface para Tipagem (TypeScript)
interface Product {
  id: number;
  name: string;
  details: string;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: { text: string; color: string };
}

// Dados simulados (Mock Data) - Futuramente virão da sua API Django
const products: Product[] = [
  {
    id: 1,
    name: "Geladeira Frost 500L",
    details: "Brastemp • Inox",
    price: 4599.00,
    oldPrice: 4899.00,
    image: "Geladeira_Brastemp_Inox_530L.jpg",
    tag: { text: "OFERTA", color: "bg-brand-500" }
  },
  {
    id: 2,
    name: "Geladeira Inox Smart",
    details: "Samsung • Wi-Fi",
    price: 5199.00,
    image: "Geladeira_Brastemp_Inox_530L2.jpg"
  },
  {
    id: 3,
    name: "Geladeira Eco 300L",
    details: "Electrolux • Branca",
    price: 3299.00,
    oldPrice: 3599.00,
    image: "Geladeira_Brastemp_Inox_530L4.jpg",
    tag: { text: "ECONÔMICA", color: "bg-green-500" }
  }
];

function Showcase() {
  return (
    <section className="flex-1 min-w-0">
      
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vitrine de Produtos</h1>
          <p className="text-sm text-slate-500 mt-1">Confira as melhores ofertas selecionadas.</p>
        </div>
        <button className="text-sm font-medium text-slate-600 hover:text-brand-600 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors">
          <i className="fa-solid fa-arrow-down-short-wide"></i> Ordenar
        </button>
      </div>

      {/* Grid de Produtos Dinâmico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
            
            {/* Imagem Container */}
            <div className="relative h-56 overflow-hidden bg-slate-50">
              {product.tag && (
                <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 ${product.tag.color}`}>
                  {product.tag.text}
                </span>
              )}
              
              <img
                src={product.image}
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
              <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1 group-hover:text-brand-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{product.details}</p>

              <div className="flex items-end justify-between">
                <div>
                  {product.oldPrice && (
                    <span className="block text-xs text-slate-400 line-through">
                      R$ {product.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="text-xl font-bold text-slate-900">
                    R$ {Math.floor(product.price).toLocaleString('pt-BR')}
                    <small className="text-sm font-normal">
                      ,{(product.price % 1).toFixed(2).substring(2)}
                    </small>
                  </span>
                </div>
                
                {/* Botão Carrinho */}
                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors">
                   <i className="fa-solid fa-cart-shopping"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="px-6 py-2 border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 text-sm font-medium transition">
          Carregar mais produtos
        </button>
      </div>
    </section>
  );
}

export default Showcase;