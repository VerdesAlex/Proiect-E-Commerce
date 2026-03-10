'use client'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Pt încărcare dinamică hartă
import { supabase } from '@/lib/supabaseClient';
import BirthdayBanner from '@/components/BirthdayBanner';

// Importăm harta cu ssr: false (Server Side Rendering oprit)
const MapWithNoSSR = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [products, setProducts] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // 1. Luăm produsele
    const { data: prodData } = await supabase.from('products').select('*');
    setProducts(prodData);

    // 2. Simulăm luarea animalelor (în realitate ar fi legate de userul logat)
    // Aici luăm toate animalele doar pt demo
    const { data: petData } = await supabase.from('pets').select('*');
    setPets(petData);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Bloc B: Banner Surpriză */}
      <BirthdayBanner pets={pets} />

      <nav className="bg-blue-600 p-4 text-white font-bold flex justify-between">
        <span>ElitePet 🐾</span>
        <span>ZooPoints: 120 (Donează?)</span>
      </nav>

      <div className="container mx-auto p-4">
        {/* Bloc A: Catalog */}
        <h1 className="text-2xl font-bold mb-4">Produse Recomandate</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <img src={product.image_url} alt={product.name} className="h-40 w-full object-cover mb-2 rounded"/>
              <h2 className="font-bold">{product.name}</h2>
              <p className="text-green-600 font-bold">{product.price} RON</p>
              <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full">Adaugă în Coș</button>
            </div>
          ))}
        </div>

        {/* Bloc E: Harta */}
        <h1 className="text-2xl font-bold mb-4">Găsește-ne fizic (Harta Live)</h1>
        <div className="rounded-lg overflow-hidden border-2 border-gray-200">
           <MapWithNoSSR />
        </div>
      </div>
    </main>
  );
}