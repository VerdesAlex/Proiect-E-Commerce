// app/produs/page.tsx
'use client'
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient'; // Atenție: supabaseClient cu 's' mic, verifică cum se numește la tine

const getSafeImage = (url: string) => (url && url.length > 5 ? url : 'https://images.unsplash.com/photo-1589924691995-400dc9ce119f?w=600&q=80');

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Funcția corectă de adăugare în coș
  const addToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (itemIndex >= 0) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image_url: product.image_url, 
        quantity: 1 
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    // Dupa adaugare, redirect catre cos
    window.location.href = '/cos';
  };

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase.from('products').select('*').eq('id', Number(id)).single();
      
      if (error) {
        console.error("Eroare Supabase:", error.message);
      } else if (data) {
        setProduct(data);
      }
      
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold">Se încarcă produsul...</div>;
  if (!product) return <div className="p-10 text-center text-red-500 font-bold">Produsul nu a fost găsit!</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Header */}
      <nav className="bg-white border-b shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-black text-green-600 tracking-tighter">elite<span className="text-orange-500">pet</span></Link>
          
          {/* Aici doar Link catre cos, fara functia de adaugare */}
          <Link href="/cos" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow transition">
            🛒 Coșul Meu
          </Link>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 p-3 text-sm text-gray-500 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex space-x-2">
          <Link href="/" className="hover:text-blue-600 hover:underline">Acasă</Link> <span>&gt;</span>
          <Link href={`/produse?categorie=${product.category}`} className="hover:text-blue-600 hover:underline uppercase">{product.category}</Link> <span>&gt;</span>
          <span className="text-gray-800 font-bold line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* Detalii Produs */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Poza */}
          <div className="md:w-1/2 p-4 border border-gray-200 rounded-xl flex justify-center items-center bg-white shadow-sm">
            <img src={getSafeImage(product.image_url)} alt={product.name} className="max-h-[400px] object-contain transition-transform hover:scale-105" />
          </div>

          {/* Info */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="text-gray-500 mb-2 uppercase tracking-widest text-xs font-bold">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 leading-tight">{product.name}</h1>
            
            <div className="bg-[#F4F5F7] p-6 rounded-2xl border border-gray-200 shadow-inner mb-6">
              <div className="text-4xl md:text-5xl font-black text-green-600 mb-2">{product.price} Lei</div>
              <p className="text-sm text-green-700 font-bold mb-6 flex items-center">
                <span className="mr-2 text-lg">✓</span> În stoc. Livrare rapidă!
              </p>
              
              {/* Butonul de adăugare REAL care executa functia */}
              <button 
                onClick={addToCart} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-md text-lg transition-transform transform hover:-translate-y-1"
              >
                🛒 Adaugă în coș
              </button>
            </div>
            
            <div className="text-sm text-gray-600 leading-relaxed border-t pt-4">
              <p>Acest produs este excelent pentru animalul tău de companie, asigurând o nutriție și o îngrijire optimă. Alege mereu calitatea ElitePet!</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// Next.js cere Suspense pentru utilizarea `useSearchParams`
export default function PaginaProdus() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Se încarcă detaliile...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}