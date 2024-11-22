import Image from 'next/image';
import Navbar from './layout/navbar';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <div className="flex flex-col bg-black text-white font-sans min-h-screen">
        <Navbar />

        <main className="flex-grow flex flex-col items-center justify-center text-center h-full">
          <div className="w-full h-full">
            <Image
              src="/Peternakan-Ayam.jpg"
              alt="Peternakan Ayam"
              layout="fill"
              objectFit="cover"
              className="opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-6xl font-bold mb-4">Chicken Disease Detection</h2>
              <p className="text-lg max-w-2xl">
                Your trusted partner in ensuring the health and productivity of your poultry. Our advanced system uses cutting-edge technology to help identify common diseases in chickens early and accurately.
              </p>
              <a
                href="#"
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-500 font-semibold"
              >
                Get Started
              </a>
            </div>
          </div>
        </main>
      </div>
      <div className='bg-gray-200 min-h-screen flex flex-col gap-20 items-center h-screen text-black'>
        <h1 className='text-black font-bold text-3xl pt-10'>Detection</h1>
          <div className=' self-start'>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Upload a clear image of your chicken</li>
              <li>Our AI analyzes the image for signs of disease</li>
              <li>Receive a detailed report of potential health issues</li>
              <li>Get recommendations for next steps</li>
            </ol>
          </div>


        <div class="flex items-center justify-center w-3/4 h-1/2">
          <label for="dropzone-file" class="flex flex-col items-center justify-center h-full w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p class="mb-2 text-sm text-gray-500 "><span class="font-semibold">Click to upload</span> or drag and drop</p>
              <p class="text-xs text-gray-500 ">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" />
          </label>
        </div>

      </div>
    </div>

  );
}
