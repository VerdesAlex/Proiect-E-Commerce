// components/ProductCarousel.tsx
'use client'
import React from 'react';
import Link from 'next/link';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// Fixăm TypeScript-ul pentru librărie
const CarouselComponent = Carousel as any;

// AICI E MAGIA PENTRU DECUPARE: partialVisibilityGutter arată X pixeli din următorul produs
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 4, partialVisibilityGutter: 60 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 4, partialVisibilityGutter: 40 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3, partialVisibilityGutter: 30 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1, partialVisibilityGutter: 60 }
};

// Săgeată Dreapta - Gri, Rotundă, Ascunsă (apare la hover pe 'group')
const CustomRightArrow = ({ onClick, ...rest }: any) => (
  <button 
    onClick={() => onClick()} 
    className="absolute right-0 z-10 w-11 h-11 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-full shadow transition-all duration-300 opacity-0 group-hover:opacity-100" 
    style={{ marginRight: '10px' }}
    aria-label="Next"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

// Săgeată Stânga - Gri, Rotundă, Ascunsă
const CustomLeftArrow = ({ onClick, ...rest }: any) => (
  <button 
    onClick={() => onClick()} 
    className="absolute left-0 z-10 w-11 h-11 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-full shadow transition-all duration-300 opacity-0 group-hover:opacity-100" 
    style={{ marginLeft: '10px' }}
    aria-label="Previous"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

interface Product {
    id: number;
    name: string;
    price: number;
    image_url: string;
    category?: string;
}

export default function ProductCarousel({ products, addToCart }: { products: Product[], addToCart: any }) {
  if (!products || products.length === 0) return null;

  return (
    // CLASA "group" ESTE ESENȚIALĂ AICI PENTRU A FACE BUTOANELE SĂ APARĂ LA HOVER
    <div className="relative group">
      <CarouselComponent
        responsive={responsive}
        infinite={true}
        partialVisible={true} // Aici activăm "decuparea"
        autoPlay={false}
        keyBoardControl={true}
        customRightArrow={<CustomRightArrow />}
        customLeftArrow={<CustomLeftArrow />}
        containerClass="carousel-container py-4"
        itemClass="px-2" // Spațiu fin între carduri
      >
        {products.map((product: Product) => {
            const safeImageUrl = product.image_url && product.image_url.length > 5 
                ? product.image_url 
                : 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80';

            return (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group/card h-full select-none">
                <div className="relative h-40 w-full p-4 bg-white flex justify-center items-center">
                    <img src={safeImageUrl} alt={product.name} className="max-h-full max-w-full object-contain group-hover/card:scale-105 transition-transform duration-300 pointer-events-none" />
                </div>
                
                <div className="p-3 flex flex-col flex-grow border-t border-gray-50">
                    <h3 className="font-bold text-xs text-black leading-tight line-clamp-2 mb-3 h-8">{product.name}</h3>
                    
                    <div className="mt-auto space-y-2">
                    <Link href={`/produs?id=${product.id}`} className="w-full block text-center border-2 border-gray-200 text-black hover:bg-gray-100 text-xs font-bold py-1.5 rounded transition">
                        🔍 Detalii
                    </Link>
                    
                    <div className="text-center py-1">
                        <p className="text-green-600 font-black text-base">{product.price} Lei</p>
                    </div>

                    <button 
                        onClick={() => addToCart(product)} 
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded shadow-sm transition-colors flex justify-center items-center space-x-1"
                    >
                        <span>🛒</span> <span>Adaugă</span>
                    </button>
                    </div>
                </div>
            </div>
            );
        })}
      </CarouselComponent>
    </div>
  );
}