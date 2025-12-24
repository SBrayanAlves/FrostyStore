import Header from "../../components/Global/Header";
import Footer from "../../components/Global/Footer";

function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 blur-2xl opacity-60 group-hover:opacity-80 transition"></div>

            <h1 className="relative text-6xl md:text-7xl font-bold tracking-tight animate-float">
              Frosty<span className="text-gray-500">Store</span>
            </h1>
          </div>

          <p className="mt-6 text-gray-600 max-w-xl">
            Uma vitrine digital moderna para exposição de geladeiras de forma
            organizada, profissional e elegante.
          </p>

          <a href="#sobre" className="mt-16 animate-bounce text-gray-400">
            ↓
          </a>
        </section>

        <section
          id="sobre"
          className="bg-gradient-to-b from-white to-softgray py-24 px-6"
        >
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-3">📦 Catálogo</h3>
              <p className="text-gray-600">
                Exibição clara e organizada dos produtos, com foco na
                experiência visual.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-3">
                🎨 Design Minimalista
              </h3>
              <p className="text-gray-600">
                Interface limpa, moderna e sem distrações, valorizando o
                produto.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-3">🚀 Desenvolvimento</h3>
              <p className="text-gray-600">
                Backend em Django REST e frontend preparado para escalar.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
