function Navbar() {
    return (
        <header className="flex justify-between items-center px-14 py-4 bg-gray-100/90 text-black shadow-lg z-10 font-semibold">
            <h1 className="text-xl font-bold">Neurora</h1>
            <nav className="flex gap-10">
                <a href="#" className="hover:scale-105">Home</a>
                <a href="#" className="hover:scale-105">Detection</a>
                <a href="#" className="hover:scale-105">Disease</a>
                <a href="#" className="hover:scale-105">About</a>
            </nav>
        </header>
    );
}

export default Navbar;
