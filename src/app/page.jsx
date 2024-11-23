"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from './layout/navbar';
import { useEffect, useState } from 'react';

export default function HomePage() {
	const [prediction, setPrediction] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [imageFile, setImageFile] = useState(null);

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
                setImageUrl(reader.result); // Set the uploaded image URL
            };
            reader.readAsDataURL(file); // Convert file to data URL
            setImageFile(file); // Save the file for prediction
        }
    };

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
			<Navbar />

			<main className="container mx-auto px-6 py-8">
				<section className="mb-12">
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
							<Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">
								Get Started
							</Button>
						</div>
					</div>
				</section>

				<section className="grid  gap-8">
					<Card className="w-full">
						<CardHeader>
							<CardTitle>Upload Image</CardTitle>
						</CardHeader>
						<CardContent>
							<form  id="imageUploadForm"  onSubmit={handlePredict}>
								<div className="grid w-full items-center gap-4">
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="image">Chicken Image</Label>
										<Input id="image" type="file" onChange={handleImageUpload} accept="image/*" />
									</div>
								</div>
							</form>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline">Clear</Button>
							<Button type="submit" form="imageUploadForm">Detect</Button>
						</CardFooter>
					</Card>

					{prediction && (<Card className="w-full">
						<CardHeader>
							<CardTitle>Detection Result</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col items-center">
							<div className="w-full aspect-square relative mb-4">
								<Image
									src={imageUrl}
									alt="Uploaded chicken image"
									layout="fill"
									objectFit="cover"
									className="rounded-lg"
								/>
							</div>
							<p className="text-lg font-semibold">Disease: <span className="text-green-600 dark:text-green-400">{prediction}</span></p>
						</CardContent>
						<CardFooter className="flex justify-center">
							<Button>Learn More</Button>
						</CardFooter>
					</Card>)}
			
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

