"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/app/layout/navbar';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function HomePage() {
    const [prediction, setPrediction] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showDescription, setShowDescription] = useState(false); // State untuk menampilkan deskripsi penyakit
    const [error, setError] = useState(""); // State untuk menyimpan pesan error

    const homeRef = useRef(null); // Ref untuk scroll ke bagian "home"
    const aboutRef = useRef(null); // Ref untuk scroll ke bagian "about"
    const detectionRef = useRef(null); // Ref untuk scroll ke bagian "detection"
    const resultRef = useRef(null); // Ref untuk scroll ke hasil prediksi
    const descriptionRef = useRef(null); // Ref untuk scroll ke deskripsi penyakit
    const chatbotRef = useRef(null); // Ref untuk scroll ke chatbot
    const inputRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Healthy");
    const [showQuestions, setShowQuestions] = useState(false);

    const questionData = {
        Healthy: [
            "1. Apa makanan terbaik untuk ayam sehat?",
            "2. Bagaimana menjaga kebersihan kandang?",
            "3. Apa vaksin yang direkomendasikan untuk ayam sehat?",
        ],
        Salmonella: [
            "1. Apa gejala Salmonella pada ayam?",
            "2. Bagaimana cara mengobati Salmonella?",
            "3. Apakah Salmonella bisa dicegah dengan vaksin?",
        ],
        Coccidiosis: [
            "1. Apa tanda-tanda Coccidiosis?",
            "2. Bagaimana cara mencegah Coccidiosis?",
            "3. Obat apa yang efektif untuk Coccidiosis?",
        ],
        "New Castle Disease": [
            "1. Apa gejala utama New Castle Disease?",
            "2. Bagaimana cara menghentikan penyebaran penyakit ini?",
            "3. Apakah ada vaksin untuk New Castle Disease?",
        ],
    };


    const sendMessageToGPT = async (message) => {
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return 'Error: Empty message received';
        }

        const formdata = new FormData();
        formdata.append("prompt", message);

        try {
            const response = await fetch('/api', {
                method: 'POST',
                body: formdata,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            console.log(data)
            return data.message || 'Error: No reply from GPT';
        } catch (error) {
            console.error('Error sending message:', error);
            return 'Error: Could not get a response from GPT';
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validate input to ensure it's not empty or null
        if (!input.trim()) {
            return;
        }

        // Add user message
        const userMessage = { id: Date.now(), role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);

        // Clear input field
        setInput('');
        setIsTyping(true);

        // Fetch GPT response
        const gptReply = await sendMessageToGPT(input);

        // Add bot reply after a delay
        setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, role: 'bot', content: gptReply },
        ]);

        setIsTyping(false);
    };


    // Fungsi scroll ke bagian tertentu
    const scrollToSection = (section) => {
        const sectionRefs = {
            home: homeRef.current,
            about: aboutRef.current,
            detection: detectionRef.current,
            result: resultRef.current,
            description: descriptionRef.current,
            chatbot: chatbotRef.current,
        };

        if (sectionRefs[section]) {
            sectionRefs[section].scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePredict = async (event) => {
        setPrediction(null);
        event.preventDefault();

        // Ambil elemen file input dari ref
        if (!inputRef.current || !inputRef.current.files.length) {
            setError("Masukkan Image sebelum deteksi"); // Tampilkan error jika file belum dipilih
            return;
        }

        const file = inputRef.current.files[0]; // Ambil file pertama dari input
        if (!file) {
            setError("Tidak ada file yang terpilih"); // Validasi ulang, meskipun harusnya tidak tercapai
            return;
        }

        setError(""); // Hapus error sebelumnya jika ada

        // Baca file untuk preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result); // Set preview image
        };
        reader.readAsDataURL(file);

        // Buat FormData untuk dikirim ke backend
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND}/predict`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Gagal mengambil prediksi. Silakan coba lagi.");
            }

            const result = await response.json();
            if (result.error) {
                setError(result.error);
                setShowQuestions(false);
            }

            // Map prediksi ke label
            const predictionMap = {
                0: "Healthy",
                1: "Salmonella",
                2: "Coccidiosis",
                3: "New Castle Disease",
            };

            const predictionLabel = predictionMap[result.prediction];
            if (!predictionLabel) {
                setError(result.error);
                setShowQuestions(false);

            }

            setPrediction(predictionLabel); // Simpan hasil prediksi
            setSelectedCategory(predictionLabel); // Update kategori yang dipilih
            setShowQuestions(true); // Tampilkan pertanyaan berdasarkan prediksi
            scrollToSection(resultRef); // Scroll ke bagian hasil prediksi

        } catch (error) {
            setError(error.message); // Tampilkan error ke pengguna
            setShowQuestions(false);
        }
    };


    const diseaseDescriptions = {
        "Healthy": "Ayam dalam kondisi sehat tanpa tanda-tanda penyakit yang terlihat. Penting untuk menjaga kondisi ini dengan memberikan nutrisi yang baik dan lingkungan yang bersih.",

        "Salmonella": "Salmonella adalah infeksi bakteri yang menyerang sistem pencernaan unggas, terutama disebabkan oleh *Salmonella enterica* dan *Salmonella gallinarum*. Infeksi ini sangat menular dan dapat menyebar dengan cepat di antara kawanan, menyebabkan kerugian ekonomi yang signifikan.",

        "Coccidiosis": "Koksidiosis, yang juga dikenal sebagai 'berak darah,' adalah penyakit unggas umum di Indonesia yang disebabkan oleh parasit protozoa dari genus *Eimeria*. Penyakit ini terutama menyerang saluran pencernaan, menyebabkan pertumbuhan terhambat, kualitas karkas yang menurun, dan kematian. Penularan terjadi melalui pakan, air, atau peralatan yang terkontaminasi, serta faktor lingkungan seperti kelembapan dan suhu yang berperan penting dalam penyebarannya.",

        "New Castle Disease": "Penyakit Newcastle (ND), yang juga dikenal sebagai tetelo, adalah penyakit virus yang sangat menular yang disebabkan oleh avian paramyxovirus (APMV-1). Pertama kali diidentifikasi di Indonesia pada tahun 1926, penyakit ini menyebar melalui kontak langsung dengan unggas yang terinfeksi, pakan, air, dan peralatan yang terkontaminasi. Gejala umum meliputi gangguan pernapasan, gangguan neurologis, dan masalah pencernaan. Pencegahan meliputi vaksinasi, peningkatan biosekuriti, dan menjaga kebersihan di lingkungan unggas."
    };

    const handleQuestionClick = async (question) => {
        // Tambahkan pertanyaan ke chat sebagai pesan pengguna
        const userMessage = { id: Date.now(), role: 'user', content: question };
        setMessages((prev) => [...prev, userMessage]);

        // Mulai proses GPT
        setIsTyping(true);
        setShowQuestions(false);


        try {
            // Kirim pertanyaan ke GPT
            const gptReply = await sendMessageToGPT(question);

            // Tambahkan balasan GPT ke chat
            const botMessage = {
                id: Date.now() + 1,
                role: 'bot',
                content: gptReply,
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching GPT response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    role: 'bot',
                    content: "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            // Sembunyikan tombol rekomendasi dan matikan indikator 'Typing...'
            setIsTyping(false);
        }
    };

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = ""; // Menghapus nilai input file
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <Navbar scrollToSection={scrollToSection} />

            <main className="container mx-auto px-6 py-8">
                <section id="home-section" className="mb-12">
                    <div className="relative h-96 rounded-lg overflow-hidden">
                        <Image
                            src="/Peternakan-Ayam.jpg"
                            alt="Peternakan Ayam"
                            layout="fill"
                            objectFit="cover"
                            className="brightness-75"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-100">CHICK CHECK</h2>
                            <h3 className="text-2xl md:text-4xl font-sans  text-gray-100 mb-4 text-center"> Chicken Disease Detection</h3>
                            <p className="text-md md:text-lg max-w-3xl text-center">
                                Mitra terpercaya Anda dalam memastikan kesehatan dan produktivitas unggas Anda. Sistem canggih kami menggunakan teknologi mutakhir untuk membantu mengidentifikasi penyakit umum pada ayam secara dini dan akurat.                            </p>
                            <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white" onClick={() => scrollToSection("about")}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                </section>

                <section id="about-section" ref={aboutRef} className="mt-12 pt-10">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>How to Use</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal list-inside space-y-2 text-lg ml-0">
                                <li>
                                    <strong>Siapkan Gambar:</strong> Ambil foto yang jelas dari kotoran ayam. Pastikan gambar memiliki pencahayaan yang baik dan fokus untuk akurasi yang lebih baik.
                                </li>
                                <li>
                                    <strong>Unggah Gambar:</strong> Klik tombol &quot;Unggah Gambar&quot; dan pilih foto dari perangkat Anda.
                                </li>
                                <li>
                                    <strong>Mulai Deteksi:</strong> Tekan tombol &quot;Deteksi&quot; untuk memulai analisis. Sistem akan memproses gambar dan memprediksi kemungkinan penyakit.
                                </li>
                                <li>
                                    <strong>Lihat Hasil:</strong> Hasil deteksi akan muncul di bawah bagian unggah. Anda dapat mengklik &quot;Pelajari Lebih Lanjut&quot; untuk informasi rinci tentang penyakit.
                                </li>
                                <li>
                                    <strong>Chat dengan Bot:</strong> Jika Anda memerlukan panduan lebih lanjut atau memiliki pertanyaan tentang pencegahan dan pengobatan, gunakan chatbot di bagian bawah.
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </section>

                <section id="detection-section" ref={detectionRef} className="grid gap-8 pt-10">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Upload Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="imageUploadForm" onSubmit={handlePredict}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="image">Chicken Image</Label>
                                        <Input id="image" type="file" accept="image/*" ref={inputRef} />
                                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Menampilkan peringatan */}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => { setPrediction(null); setImageUrl(null); handleClear(); }}>Clear</Button>
                            <Button type="submit" form="imageUploadForm">Detect</Button>
                        </CardFooter>
                    </Card>

                    {prediction && (
                        <Card >
                            <CardHeader>
                                <CardTitle>Detection Result</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                <div className="w-64 h-64 relative mb-4"> {/* Ukuran gambar diperkecil */}
                                    <Image
                                        src={imageUrl}
                                        alt="Uploaded chicken image"
                                        layout="fill"
                                        className="rounded-lg"
                                    />
                                </div>
                                <p className="text-lg font-semibold">
                                    Disease: <span className="text-green-600 dark:text-green-400">{prediction}</span>
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button onClick={() => {
                                    setShowDescription((prev) => !prev);
                                    if (!showDescription) {
                                        setTimeout(() => scrollToSection("description"), 200); // Delay untuk memastikan UI update
                                    }
                                }}>
                                    {showDescription ? "Show Less" : "Learn More"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Kotak Deskripsi Penyakit Pisah */}
                    {showDescription && prediction && (
                        <div ref={descriptionRef} className="mt-8 p-6 bg-green-100 text-green-800 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Disease Description</h3>
                            <p className="text-lg">
                                {diseaseDescriptions[prediction]} If you have further information, you can check our chatbot.
                            </p>
                            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => scrollToSection("chatbot")}>
                                Go to Chatbot
                            </Button>
                        </div>
                    )}

                </section>
                {/* Chatbot Section */}
                <section className="mt-12 h-[calc(100vh-3rem)]">
                    <Card className="bg-white text-gray-800 shadow-lg h-full">
                        <CardHeader>
                            <CardTitle>Chatbot</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-5rem)] flex flex-col">
                            <p className="text-lg mb-4">
                                Chat with our bot for more details on disease prevention and treatment.
                            </p>
                            <div className="flex flex-col h-[calc(100%-5rem)] md:h-[calc(100%-2rem)]">
                                <ScrollArea className="flex-grow mb-4 p-4 border rounded-md w-full">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`list-decimal mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}
                                        >
                                            <ReactMarkdown
                                                className={`inline-block p-2 rounded-lg prose ${m.role === "user"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-black"
                                                    }`}
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="text-left">
                                            <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">
                                                Typing...
                                            </span>
                                        </div>
                                    )}
                                    {showQuestions && (
                                        <div className="bg-gray-100 p-4 rounded-md absolute bottom-5 left-5 right-5">
                                            <h2 className="text-lg font-semibold mb-2">Rekomendasi Pertanyaan</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {questionData[selectedCategory].map((question, index) => (
                                                    <button
                                                        key={index}
                                                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                                        onClick={() => handleQuestionClick(question)}
                                                    >
                                                        {question}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </ScrollArea>
                                <form
                                    onSubmit={(e) => {
                                        setShowQuestions(false); // Hide questions on form submission
                                        onSubmit(e);
                                    }}
                                    className="flex space-x-2 mb-4"
                                >
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Say something..."
                                        className="flex-grow"
                                    />

                                    <Button type="submit">Send</Button>
                                </form>

                            </div>
                        </CardContent>
                    </Card>
                </section>

            </main>

            <footer className="bg-white dark:bg-gray-800 shadow-md mt-12">
                <div className="container mx-auto px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                    © 2024 Chicken Disease Detection. All rights reserved.
                </div>
            </footer>
        </div>
    );
}