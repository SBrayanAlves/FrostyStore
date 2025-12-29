function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col items-center justify-between gap-2 text-sm text-gray-500 md:flex-row">
                
                <span>
                    © {new Date().getFullYear()} <strong className="font-medium text-gray-700">FrostyStore</strong>. 
                    Todos os direitos reservados.
                </span>

                <span className="text-xs md:text-sm">
                    Desenvolvido por <span className="font-medium text-gray-700">Sebastião Brayan</span>
                </span>

            </div>
        </footer>
    )
}

export default Footer
