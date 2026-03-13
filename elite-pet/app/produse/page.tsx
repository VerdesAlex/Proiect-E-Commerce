// app/produse/page.tsx
'use client'
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient';

// Fallback pentru imagini
const getSafeImage = (url: string) => (url && url.length > 5 ? url : 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80');

function CatalogContent() {
  const searchParams = useSearchParams();
  const categorieDinLink = searchParams.get('categorie') || 'toate';

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stările pentru filtre
  const [selectedCategory, setSelectedCategory] = useState(categorieDinLink);
  const [maxPrice, setMaxPrice] = useState(500);

  // Extragem produsele din baza de date
  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('products').select('*');
      if (data) {
        setProducts(data);
        setFiltered(data); // La început, arătăm tot
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Funcția de Filtrare (se declanșează când schimbi prețul sau categoria)
  useEffect(() => {
    let rezultat = products;

    // Filtru Categorie
    if (selectedCategory !== 'toate') {
      rezultat = rezultat.filter(p => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // Filtru Preț
    rezultat = rezultat.filter(p => p.price <= maxPrice);

    setFiltered(rezultat);
  }, [selectedCategory, maxPrice, products]);

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* Header simplu */}
      <nav className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between">
          <Link href="/" className="text-2xl font-black text-green-600">elite<span className="text-orange-500">pet</span></Link>
          <Link href="/cos" className="bg-green-600 text-white px-4 py-2 rounded font-bold">🛒 Coșul Meu</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6 mt-4">
        
        {/* SIDEBAR - Filtre (tip eMAG) */}
        <aside className="w-full md:w-1/4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm h-fit">
          <h2 className="font-bold text-lg mb-4 border-b pb-2">Filtrează Produsele</h2>
          
          {/* Categorie */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Categorie</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === 'toate'} onChange={() => setSelectedCategory('toate')} className="text-green-600 focus:ring-green-500" />
                <span>Toate produsele</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === 'caini'} onChange={() => setSelectedCategory('caini')} className="text-green-600" />
                <span>Câini</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === 'pisici'} onChange={() => setSelectedCategory('pisici')} className="text-green-600" />
                <span>Pisici</span>
              </label>
            </div>
          </div>

          {/* Preț */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Preț Maxim: <span className="text-green-600 font-bold">{maxPrice} Lei</span></h3>
            <input 
              type="range" 
              min="10" 
              max="500" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10 Lei</span>
              <span>500 Lei</span>
            </div>
          </div>
        </aside>

        {/* REZULTATE PRODUSE */}
        <section className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold mb-4">Catalog Produse ({filtered.length} rezultate)</h1>
          
          {loading ? <p>Se încarcă produsele...</p> : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map(product => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition flex flex-col overflow-hidden">
                  <div className="h-40 w-full p-2 flex justify-center items-center">
                    <img src={getSafeImage(product.image_url)} alt={product.name} className="max-h-full object-contain" />
                  </div>
                  <div className="p-3 flex flex-col flex-grow border-t border-gray-50">
                    <h3 className="font-semibold text-xs text-gray-800 line-clamp-2 mb-3">{product.name}</h3>
                    <div className="mt-auto">
                      <p className="text-green-600 font-black text-sm text-center mb-2">{product.price} Lei</p>
                      {/* LINK DINAMIC CATRE PRODUS */}
                      <Link href={`/produs?id=${product.id}`} className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-1.5 rounded mb-2 transition">
                        🔍 Detalii
                      </Link>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 rounded transition">
                        🛒 Adaugă
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

// Next.js cere ca componentele cu "useSearchParams" să fie învelite în Suspense
export default function ProdusePage() {
  return <Suspense fallback={<div>Se încarcă catalogul...</div>}><CatalogContent /></Suspense>;
}