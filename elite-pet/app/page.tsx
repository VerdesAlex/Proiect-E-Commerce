'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from '../lib/SupabaseClient';

const MapWithNoSSR = dynamic(() => import('../components/Map'), { ssr: false, loading: () => <p className="p-4 text-gray-500">Harta se încarcă...</p> });

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBirthday] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    // Grab the name they registered with (default to Client if somehow missing)
    setUserName(localStorage.getItem('userName') || 'Client');
  }, []);

  // Simple logout function
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Începem extragerea produselor pentru Home...");
        
        // Luăm produsele din Supabase
        const { data, error } = await supabase.from('products').select('*');
        
        if (error) {
          console.error('Eroare la extragerea Supabase:', error.message);
          setProducts([]); // Dacă e eroare, golim lista ca să nu crape
        } else if (data) {
          console.log("Produse găsite:", data.length);
          setProducts(data);
        }
      } catch (err) {
        console.error("Eroare neașteptată:", err);
      } finally {
        // Indiferent dacă a mers sau a crăpat, OPRIM SPINNERUL!
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Banner Aniversar */}
      {isBirthday && (
        <div className="bg-yellow-400 px-4 py-1.5 text-center text-yellow-900 font-semibold text-xs border-b border-yellow-500 tracking-wide">
          🎉 La mulți ani, Max! Ai 20% REDUCERE la jucării folosind codul: <span className="font-bold">MAX20</span>
        </div>
      )}

      {/* Header Principal */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-3xl font-black tracking-tighter text-green-600">elite<span className="text-orange-500">pet</span></Link>
            <span className="text-xs text-gray-400 hidden md:block ml-2 mt-2">magazin online pentru animale</span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            {isLoggedIn ? (
               <div className="hidden sm:flex items-center space-x-3">
                 <span className="text-sm font-bold text-green-600">👤 Salut, {userName.split(' ')[0]}!</span>
                 <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 underline">Ieșire</button>
               </div>
            ) : (
               <Link href="/register" className="text-sm font-bold text-gray-500 hover:text-green-600 hidden sm:block">👤 Intră în cont</Link>
            )}
            
            <div className="text-sm font-semibold text-gray-600 hidden sm:block border-l border-gray-300 pl-4">
              ZooPoints: <span className="text-orange-500 font-bold">120</span>
            </div>
            
            <Link href="/cos" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition flex items-center">
              🛒 Coșul Meu
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex space-x-8 text-sm font-bold text-gray-700 p-3 overflow-x-auto">
            <Link href="/produse?categorie=caini" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Câini</Link>
            <Link href="/produse?categorie=pisici" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Pisici</Link>
            <Link href="/produse?categorie=pasari" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Păsări</Link>
            <Link href="/produse" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Toate Produsele</Link>
          </div>
        </div>
      </nav>

      {/* Bannere Promoționale Mari */}
      <section className="max-w-7xl mx-auto mt-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-white flex flex-col justify-center shadow-md relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 z-10">zoodays</h2>
            <p className="text-xl md:text-2xl font-bold z-10">PÂNĂ LA 40% REDUCERE</p>
            <span className="absolute top-4 right-4 bg-white text-rose-600 text-xs font-black px-2 py-1 rounded">12-16 MARTIE</span>
            <div className="absolute right-[-20px] bottom-[-40px] opacity-20 text-[150px]">🐾</div>
          </div>
          <div className="bg-rose-500 rounded-2xl p-6 text-white flex flex-col justify-center shadow-md">
            <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight">Ai 25 lei reducere la prima comandă în APP</h3>
            <div className="mt-4 bg-rose-700 w-max px-3 py-1 rounded text-sm font-bold border border-rose-400">Cod: APP-NEW</div>
          </div>
        </div>
      </section>

      {/* Cele 3 beneficii */}
      <section className="max-w-7xl mx-auto mt-8 px-4 md:px-6 border-b border-gray-300 pb-8 hidden md:block">
        <div className="text-center mb-6">
          <span className="bg-[#F4F5F7] px-4 text-gray-500 text-sm font-semibold relative top-[10px]">Numărul meu 1 în articole pentru animale</span>
          <hr className="border-gray-300" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600 text-xl">🔄</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Economisește 5% la comenzi</p>
              <p className="text-xs text-gray-500">cu abonament Autoship</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-l border-gray-100 pl-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 text-xl">⭐</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Câștigă mai multe recompense</p>
              <p className="text-xs text-gray-500">Înregistrează-te gratuit</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-l border-gray-100 pl-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-xl">📱</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Ai 25 lei reducere in APP</p>
              <p className="text-xs text-gray-500">Descarcă aplicația acum</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-12 mt-4">
        
        {/* Bloc A: Catalog Produse */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recomandate pentru tine</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {products.map(product => {
                // FALLBACK: Dacă nu ai poză în baza de date, punem una default drăguță
                const safeImageUrl = product.image_url && product.image_url.length > 5 
                  ? product.image_url 
                  : 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80';

                return (
                  <div key={product.id} className="bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group">
                    {/* Poza mai mică și încadrată */}
                    <div className="relative h-32 md:h-40 w-full p-2 bg-white flex justify-center items-center">
                      <img src={safeImageUrl} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    
                    <div className="p-3 flex flex-col flex-grow border-t border-gray-50">
                      {/* Textul mai mic */}
                      <h3 className="font-semibold text-[11px] md:text-xs text-gray-800 leading-tight line-clamp-2 mb-3">{product.name}</h3>
                      
                      <div className="mt-auto space-y-2">
                        {/* 1. Prețul - Sus */}
                        <div className="text-center py-1">
                          <p className="text-green-600 font-black text-sm md:text-base">{product.price} Lei</p>
                        </div>
                        
                        {/* 2. Buton Detalii - Mijloc */}
                        <Link href={`/produs?id=${product.id}`} className="w-full block text-center border border-gray-300 text-gray-600 hover:bg-gray-100 text-[10px] md:text-[11px] font-bold py-1 md:py-1.5 rounded transition">
                          🔍 Detalii
                        </Link>
                        
                        
                        {/* 3. Buton Adaugă cu Fill (Verde Plin) - Jos */}
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white text-[11px] md:text-xs font-bold py-1.5 md:py-2 rounded shadow-sm transition-colors flex justify-center items-center space-x-1">
                          <span>🛒</span> <span>Adaugă</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bloc E: Harta */}
        <section className="pb-12 mt-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Magazine & Click&Collect</h2>
          <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm relative z-0">
            <MapWithNoSSR />
          </div>
        </section>

      </div>
    </main>
  );
}