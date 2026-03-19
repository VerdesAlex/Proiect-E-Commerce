// app/produs/page.tsx
'use client'
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient'; 

const getSafeImage = (url: string) => (url && url.length > 5 ? url : 'https://images.unsplash.com/photo-1589924691995-400dc9ce119f?w=600&q=80');

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Stări pentru sistemul de Rating
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

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
    window.location.href = '/cos';
  };

  const handleRating = async (selectedRating: number) => {
    if (hasVoted || isVoting || !product) return;
    setIsVoting(true);

    const currentAvg = product.rating || 0; // Dacă nu are rating, pornim de la 0
    const currentCount = product.reviews_count || 0;

    const newCount = currentCount + 1;
    const newAvg = Number((((currentAvg * currentCount) + selectedRating) / newCount).toFixed(1));

    const { error } = await supabase
      .from('products')
      .update({ rating: newAvg, reviews_count: newCount })
      .eq('id', product.id);

    if (error) {
      console.error("Eroare la votare:", error.message);
      alert("A apărut o eroare. Încearcă din nou!");
    } else {
      setProduct({ ...product, rating: newAvg, reviews_count: newCount });
      setHasVoted(true); 
    }
    
    setIsVoting(false);
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

  // Calculăm ce notă afișăm: nota pe care ținem mouse-ul (dacă există) SAU media produsului. 
  // Dacă nu are rating încă, afișăm 0 ca să fie gri toate.
  const displayRating = hoverRating > 0 ? hoverRating : (product.rating || 0);

  return (
    <div className="min-h-screen bg-white font-sans">
      
      <nav className="bg-white border-b shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-black text-green-600 tracking-tighter">elite<span className="text-orange-500">pet</span></Link>
          <Link href="/cos" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow transition">
            🛒 Coșul Meu
          </Link>
        </div>
      </nav>

      <div className="bg-gray-50 p-3 text-sm text-gray-500 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex space-x-2">
          <Link href="/" className="hover:text-blue-600 hover:underline">Acasă</Link> <span>&gt;</span>
          <Link href={`/produse?categorie=${product.category}`} className="hover:text-blue-600 hover:underline uppercase">{product.category}</Link> <span>&gt;</span>
          <span className="text-gray-800 font-bold line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          <div className="md:w-1/2 p-4 border border-gray-200 rounded-xl flex justify-center items-center bg-white shadow-sm relative">
            <img src={getSafeImage(product.image_url)} alt={product.name} className="max-h-[400px] object-contain transition-transform hover:scale-105" />
          </div>

          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="text-gray-500 mb-2 uppercase tracking-widest text-xs font-bold">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 leading-tight">{product.name}</h1>
            
            {/* COMPONENTA DE RATING */}
            <div className="flex flex-col mb-6">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  
                  // Calculăm cât la sută din stea trebuie să fie galbenă
                  const fillPercentage = Math.max(0, Math.min(100, (displayRating - star + 1) * 100));

                  return (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => !hasVoted && setHoverRating(star)} // Setăm hover-ul
                      onMouseLeave={() => !hasVoted && setHoverRating(0)} // Resetăm hover-ul
                      disabled={hasVoted || isVoting}
                      className={`relative text-3xl transition-transform ${hasVoted ? 'cursor-default' : 'hover:scale-110'}`}
                      title={hasVoted ? "Ai votat deja" : `Acordă ${star} stele`}
                    >
                      {/* BAZA: Steaua gri mereu vizibilă dedesubt */}
                      <span className="text-gray-200">★</span>
                      
                      {/* FOREGROUND: Steaua galbenă care vine PESTE cea gri, decupată procentual */}
                      <span 
                        className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
                        style={{ width: `${fillPercentage}%` }}
                      >
                        ★
                      </span>
                    </button>
                  );
                })}
                
                <span className="text-sm text-gray-500 font-bold ml-3 mt-1 bg-gray-100 px-2 py-0.5 rounded">
                  {product.rating ? Number(product.rating).toFixed(1) : '0.0'} 
                  <span className="font-normal ml-1">({product.reviews_count || 0} review-uri)</span>
                </span>
              </div>
              
              {hasVoted && (
                <span className="text-xs text-green-600 font-bold mt-1 animate-fade-in">
                  ✓ Mulțumim pentru părere!
                </span>
              )}
            </div>

            <div className="bg-[#F4F5F7] p-6 rounded-2xl border border-gray-200 shadow-inner mb-6">
              <div className="text-4xl md:text-5xl font-black text-green-600 mb-2">{product.price} Lei</div>
              <p className="text-sm text-green-700 font-bold mb-6 flex items-center">
                <span className="mr-2 text-lg">✓</span> În stoc. Livrare rapidă!
              </p>
              
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

export default function PaginaProdus() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Se încarcă detaliile...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}