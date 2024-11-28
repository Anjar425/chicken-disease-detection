"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from './layout/navbar';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function HomePage() {
    const [prediction, setPrediction] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showDescription, setShowDescription] = useState(false); // State untuk menampilkan deskripsi penyakit

    const homeRef = useRef(null); // Ref untuk scroll ke bagian "home"
    const aboutRef = useRef(null); // Ref untuk scroll ke bagian "about"
    const detectionRef = useRef(null); // Ref untuk scroll ke bagian "detection"
    const resultRef = useRef(null); // Ref untuk scroll ke hasil prediksi
    const descriptionRef = useRef(null); // Ref untuk scroll ke deskripsi penyakit
    const chatbotRef = useRef(null); // Ref untuk scroll ke chatbot

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

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
        event.preventDefault();

        if (!imageFile) {
            alert("Please upload an image first.");
            return;
        }
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await fetch("https://perceptive-net-442521-c9.et.r.appspot.com/predict", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch prediction.");
            }

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }

            const predictionMap = {
                0: 'Healthy',
                1: 'Salmonella',
                2: 'Coccidiosis',
                3: 'New Castle Disease'
            };

            const predictionLabel = predictionMap[result.prediction];
            setPrediction(predictionLabel);

            scrollToSection(resultRef);

        } catch (error) {
            console.error("Error during prediction:", error);
            alert("Error during prediction: " + error.message);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const diseaseDescriptions = {
        "Healthy": "The chicken is healthy with no visible signs of disease. It is important to maintain this condition by providing proper nutrition and a clean environment.",

        "Salmonella": "Salmonella is a bacterial infection that affects the digestive system of poultry, primarily caused by *Salmonella enterica* and *Salmonella gallinarum*. This infection is highly contagious and can spread rapidly within flocks, leading to significant economic losses.",

        "Coccidiosis": "Coccidiosis, also known as 'berak darah,' is a common poultry disease in Indonesia caused by protozoan parasites from the genus *Eimeria*. It primarily affects the digestive tract, leading to growth retardation, reduced carcass quality, and mortality. Transmission occurs through contaminated feed, water, or equipment, and environmental factors such as humidity and temperature play a crucial role in its spread.",

        "New Castle Disease": "Newcastle Disease (ND), also known as tetelo, is a highly contagious viral disease caused by avian paramyxovirus (APMV-1). First identified in Indonesia in 1926, it spreads through direct contact with infected birds, contaminated feed, water, and equipment. Common symptoms include respiratory distress, neurological disorders, and digestive issues. Prevention includes vaccination, improved biosecurity, and maintaining cleanliness in poultry environments."
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
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">Chicken Disease Detection</h2>
                            <p className="text-lg md:text-xl max-w-2xl text-center">
                                Your trusted partner in ensuring the health and productivity of your poultry. Our advanced system uses cutting-edge technology to help identify common diseases in chickens early and accurately.
                            </p>
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
                            <ol className="list-decimal list-inside space-y-2 text-lg">
                                <li>
                                    <strong>Prepare an Image:</strong> Take a clear photo of the chicken&apos;s feces. Ensure the image is well-lit and focused for better accuracy.
                                </li>
                                <li>
                                    <strong>Upload the Image:</strong> Click the &quot;Upload Image&quot; button and select the photo from your device.
                                </li>
                                <li>
                                    <strong>Start Detection:</strong> Press the &quot;Detect&quot; button to begin the analysis. The system will process the image and predict any potential disease.
                                </li>
                                <li>
                                    <strong>View Results:</strong> The detection result will appear below the upload section. You can click &quot;Learn More&quot; for detailed disease information.
                                </li>
                                <li>
                                    <strong>Chat with the Bot:</strong> If you need further guidance or have questions about prevention and treatment, use the chatbot at the bottom.
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
                                        <Input id="image" type="file" onChange={handleImageUpload} accept="image/*" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => { setPrediction(null); setImageUrl(null); }}>Clear</Button>
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
                <section ref={chatbotRef} className="mt-12 h-[calc(100vh-3rem)]">
                    <Card className="bg-white text-gray-800 shadow-lg h-full">
                        <CardHeader>
                            <CardTitle>Chatbot</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-5rem)] flex flex-col">
                            <p className="text-lg mb-4">Chat with our bot for more details on disease prevention and treatment.</p>
                            <div className="flex flex-col h-[calc(100%-5rem)] md:h-[calc(100%-2rem)]">
                                <ScrollArea className="flex-grow mb-4 p-4 border rounded-md ">
                                    {messages.map((m) => (
                                        <div key={m.id} className={`list-decimal mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            <ReactMarkdown
                                                className={`inline-block p-2 rounded-lg prose ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="text-left">
                                            <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">Typing...</span>
                                        </div>
                                    )}
                                </ScrollArea>
                                <form onSubmit={onSubmit} className="flex space-x-2">
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