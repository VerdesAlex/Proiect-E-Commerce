// app/produs/page.tsx
'use client'
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient';

const getSafeImage = (url: string) => (url && url.length > 5 ? url : 'https://images.unsplash.com/photo-1589924691995-400dc9ce119f?w=600&q=80');

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 1; // Luăm ID-ul din URL, default 1

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      // Verificăm dacă avem un ID valid în link
      if (!id) {
        setLoading(false);
        return;
      }
      
      // Am pus Number(id) ca să îl caute corect în baza de date!
      const { data, error } = await supabase.from('products').select('*').eq('id', Number(id)).single();
      
      if (error) {
        console.error("Eroare Supabase:", error.message);
      }
      
      if (data) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold">Se încarcă produsul...</div>;
  if (!product) return <div className="p-10 text-center text-red-500 font-bold">Produsul nu a fost găsit!</div>;

  // Pui asta sus în fișier (la componentele unde ai produsele afișate)
  const addToCart = (productToAdd: any) => {
    // 1. Luăm coșul vechi (dacă nu e nimic, punem un array gol)
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // 2. Căutăm dacă produsul e deja în coș
    const itemIndex = existingCart.findIndex((item: any) => item.id === productToAdd.id);
    
    if(itemIndex >= 0) {
      // Dacă există, doar îi mărim cantitatea
      existingCart[itemIndex].quantity += 1;
    } else {
      // Dacă nu există, îl adăugăm nou cu cantitatea 1
      existingCart.push({ 
        id: productToAdd.id, 
        name: productToAdd.name, 
        price: productToAdd.price, 
        image_url: productToAdd.image_url, 
        quantity: 1 
      });
    }
    
    // 3. Salvăm în browser
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert('Adăugat în coș! 🐾');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mini-Header */}
      <nav className="bg-white border-b shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <Link href="/" className="text-2xl font-black text-green-600">elite<span className="text-orange-500">pet</span></Link>
          <Link href="/cos" className="bg-green-600 text-white px-4 py-2 rounded font-bold">🛒 Coșul</Link>
        </div>
      </nav>

      {/* Breadcrumbs - ACUM SUNT LINK-URI REALE */}
      <div className="bg-gray-50 p-3 text-sm text-gray-500 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex space-x-2">
          <Link href="/" className="hover:text-blue-600 hover:underline">Acasă</Link> <span>&gt;</span>
          <Link href={`/produse?categorie=${product.category}`} className="hover:text-blue-600 hover:underline uppercase">{product.category}</Link> <span>&gt;</span>
          <span className="text-gray-800 font-bold line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 mt-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Poza dinamică */}
          <div className="md:w-1/2 p-4 border border-gray-200 rounded-xl flex justify-center items-center">
            <img src={getSafeImage(product.image_url)} alt={product.name} className="max-h-[400px] object-contain" />
          </div>

          {/* Detalii dinamice */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-6 uppercase tracking-wider text-sm font-bold">Categorie: {product.category}</p>
            
            <div className="bg-[#F4F5F7] p-6 rounded-xl border border-gray-200 mb-6">
              <div className="text-4xl font-black text-green-600 mb-4">{product.price} Lei</div>
              <p className="text-sm text-green-700 font-bold mb-4">✓ În stoc. Livrare în 24-48h.</p>
              
              <Link href="/cos">
                <button onClick={() => addToCart(product)}className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow text-lg transition">
                  🛒 Adaugă în coș
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaginaProdus() {
  return <Suspense fallback={<div>Se încarcă...</div>}><ProductDetailContent /></Suspense>;
}