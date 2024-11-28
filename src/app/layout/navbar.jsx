import { useRef } from 'react';

function Navbar({ scrollToSection }) {
    return (
        <header className="flex justify-between items-center px-14 py-4 bg-gray-100/90 text-black shadow-lg z-10 font-semibold">
            <h1 className="text-xl font-bold">Neurora</h1>
            <nav className="flex gap-10">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('home');
                    }}
                    className="hover:scale-105"
                >
                    Home
                </a>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('about');
                    }}
                    className="hover:scale-105"
                >
                    About
                </a>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('detection');
                    }}
                    className="hover:scale-105"
                >
                    Detection
                </a>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('chatbot');
                    }}
                    className="hover:scale-105"
                >
                    Chatbot
                </a>
            </nav>
        </header>
    );
}

export default Navbar;
