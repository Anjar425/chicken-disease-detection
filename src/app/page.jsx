"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from './layout/navbar';
import { useEffect, useState, useRef } from 'react';

export default function HomePage() {
    const [prediction, setPrediction] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showDescription, setShowDescription] = useState(false); // State untuk menampilkan deskripsi penyakit

    const [activeSection, setActiveSection] = useState("home"); // State untuk navbar aktif
    const detectionRef = useRef(null); // Ref untuk scroll ke bagian "detection"
	const resultRef = useRef(null); // Ref untuk scroll ke hasil prediksi
	const descriptionRef = useRef(null); // Ref untuk scroll ke deskripsi penyakit
    const chatbotRef = useRef(null); // Ref untuk scroll ke chatbot


    // Fungsi scroll ke bagian tertentu
    const scrollToSection = (ref) => {
		if (ref?.current) {
			ref.current.scrollIntoView({ behavior: "smooth" });
		}
	};

    // Update active section berdasarkan scroll
    useEffect(() => {
        const sections = [
            { id: "home", ref: document.getElementById("home-section") },
            { id: "detection", ref: document.getElementById("detection-section") },
            { id: "about", ref: document.getElementById("about-section") },
        ];

        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((section) => {
            if (section.ref) observer.observe(section.ref);
        });

        return () => observer.disconnect();
    }, []);

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
            <Navbar activeSection={activeSection} />

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
                            <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white" onClick={() => scrollToSection(detectionRef)}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                </section>

                <section id="detection-section" ref={detectionRef} className="grid gap-8 pt-20">
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
						<Card ref={resultRef}>
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
										setTimeout(() => scrollToSection(descriptionRef), 200); // Delay untuk memastikan UI update
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
							<Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => scrollToSection(chatbotRef)}>
								Go to Chatbot
							</Button>
						</div>
					)}

                </section>
                {/* Chatbot Section */}
                <section ref={chatbotRef} className="mt-12">
                    <Card className="bg-white text-gray-800 shadow-lg">
                        <CardHeader>
                            <CardTitle>Chatbot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">Chat with our bot for more details on disease prevention and treatment.</p>
                        </CardContent>
                    </Card>
                </section>
            </main>

            <footer className="bg-white dark:bg-gray-800 shadow-md mt-12">
                <div className="container mx-auto px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                    © 2023 Chicken Disease Detection. All rights reserved.
                </div>
            </footer>
        </div>
    );
}