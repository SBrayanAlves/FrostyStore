import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from './dashboard_components/Sidebar'
import Showcase from './dashboard_components/Showcase'

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:24px_24px]">

      <Header />

      <main className="flex-1 pt-24 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-12">

        <Sidebar />
        <Showcase />

      </main>
      
      <Footer />
    </div>
  )
}

export default Dashboard