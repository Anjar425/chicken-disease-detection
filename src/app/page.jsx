import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from './layout/navbar';

export default function HomePage() {
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
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="image">Chicken Image</Label>
                    <Input id="image" type="file" accept="image/*" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Clear</Button>
              <Button>Detect</Button>
            </CardFooter>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Detection Result</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full aspect-square relative mb-4">
                <Image
                  src="/placeholder.svg"
                  alt="Uploaded chicken image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <p className="text-lg font-semibold">Disease: <span className="text-green-600 dark:text-green-400">Healthy</span></p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button>Learn More</Button>
            </CardFooter>
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

