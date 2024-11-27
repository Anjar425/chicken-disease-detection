import { useEffect, useState } from "react";

function Navbar() {
    const [activeSection, setActiveSection] = useState("home");
    const [isManualClick, setIsManualClick] = useState(false); // Flag untuk memeriksa apakah klik manual terjadi

    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId); // Langsung set aktif section
        setIsManualClick(true); // Tandai bahwa klik telah dilakukan
    };

    useEffect(() => {
        const sections = [
            { id: "home", ref: document.getElementById("home-section") },
            { id: "detection", ref: document.getElementById("detection-section") },
            { id: "disease", ref: document.getElementById("disease-section") },
            { id: "about", ref: document.getElementById("about-section") },
        ];

        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5, // Trigger saat 50% elemen terlihat
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isManualClick) { 
                    // Hanya ubah aktif section jika tidak ada klik manual
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((section) => {
            if (section.ref) observer.observe(section.ref);
        });

        // Reset flag isManualClick setelah beberapa detik (misalnya 1 detik) untuk menghindari perubahan status setelah scroll
        
    }, [isManualClick]); // Perbarui observer jika flag isManualClick berubah

    return (
        <header className="flex justify-between items-center px-14 py-4 bg-gray-100/90 text-black shadow-lg z-10 font-semibold fixed top-0 w-full">
            <h1 className="text-xl font-bold">Neurora</h1>
            <nav className="flex gap-10">
                <a
                    href="#home-section"
                    onClick={() => handleNavClick("home")} // Menggunakan handleNavClick untuk perubahan manual
                    className={`hover:scale-105 ${
                        activeSection === "home" ? "text-green-600 font-bold" : "text-black"
                    }`}
                >
                    Home
                </a>
                <a
                    href="#detection-section"
                    onClick={() => handleNavClick("detection")}
                    className={`hover:scale-105 ${
                        activeSection === "detection" ? "text-green-600 font-bold" : "text-black"
                    }`}
                >
                    Detection
                </a>
                <a
                    href="#disease-section"
                    onClick={() => handleNavClick("disease")}
                    className={`hover:scale-105 ${
                        activeSection === "disease" ? "text-green-600 font-bold" : "text-black"
                    }`}
                >
                    Disease
                </a>
                <a
                    href="#about-section"
                    onClick={() => handleNavClick("about")}
                    className={`hover:scale-105 ${
                        activeSection === "about" ? "text-green-600 font-bold" : "text-black"
                    }`}
                >
                    About
                </a>
            </nav>
        </header>
    );
}

export default Navbar;
