// app/cos/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export default function PaginaCos() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setMounted(true);
  }, []);

  // Funcție pentru ștergerea completă a produsului
  const removeFromCart = (id: number) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // Funcție NOUĂ pentru modificarea cantității (+ și -)
  const updateQuantity = (id: number, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        // Ne asigurăm că nu putem scădea sub 1 bucată
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!mounted) return <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center text-black font-bold">Se încarcă coșul...</div>;

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans">
      <nav className="bg-white p-4 shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tight text-green-600">elite<span className="text-orange-500">pet</span></Link>
          <span className="text-sm font-bold text-black">Coșul Meu</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-6 mt-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-black mb-6">Produse în coș</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-black mb-2">Coșul tău este gol</h2>
            <p className="text-gray-800 mb-8">Nu ai adăugat încă niciun produs.</p>
            <Link href="/produse">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow transition">
                Începe cumpărăturile
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row justify-between border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0 gap-4">
                  
                  {/* Stânga: Poza și Titlul */}
                  <div className="flex items-start space-x-4 md:w-2/3">
                    <img src={item.image_url} alt={item.name} className="w-24 h-24 object-contain rounded border border-gray-300 p-2 bg-white" />
                    <div>
                      <Link href={`/produs?id=${item.id}`} className="font-bold text-black text-sm md:text-base hover:text-blue-600 hover:underline line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-xs text-green-700 font-bold mt-2">✓ În stoc</p>
                    </div>
                  </div>

                  {/* Dreapta: Preț, Cantitate (eMAG style), Șterge */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start md:w-1/3 mt-2 md:mt-0">
                    <div className="text-xl font-black text-black mb-3">
                      {item.price * item.quantity} Lei
                    </div>
                    
                    <div className="flex flex-col items-end">
                      {/* Selectorul de Cantitate */}
                      <div className="flex items-center bg-gray-100 rounded-full p-1 mb-2 shadow-inner border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold transition ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'bg-white shadow-sm text-black hover:bg-gray-50'}`}
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-black text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-lg font-bold text-black hover:bg-gray-50 transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Butonul de Ștergere */}
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-500 hover:text-red-600 font-semibold border-b border-dashed border-gray-400 hover:border-red-600 transition">
                        Șterge
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              {/* Subsolul Coșului */}
              <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-6 border-t border-gray-200 pt-6">
                <Link href="/produse" className="text-blue-700 hover:underline font-bold mb-4 md:mb-0">
                  &larr; Continuă cumpărăturile
                </Link>
                <div className="text-right">
                  <p className="text-gray-900 mb-1 font-semibold">Subtotal: {total} Lei</p>
                  <p className="text-sm text-gray-900 mb-2 border-b border-gray-200 pb-2">Transport: <span className="font-bold text-green-700">Calculat la finalizare</span></p>
                  <h2 className="text-3xl font-black text-black">Total: {total} Lei</h2>
                </div>
              </div>
            </div>

            {/* Butonul Către Checkout */}
            <div className="text-right bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              {isLoggedIn ? (
                <Link href="/checkout">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl shadow-md transition text-lg w-full md:w-auto transform hover:scale-[1.02]">
                    Pasul Următor: Livrare & Plată &rarr;
                  </button>
                </Link>
              ) : (
                <div className="flex flex-col items-end">
                  <p className="text-red-600 font-bold mb-3">⚠️ Trebuie să fii autentificat pentru a comanda.</p>
                  <Link href="/register">
                    <button className="bg-[#183251] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow-md transition w-full md:w-auto">
                      👤 Intră în cont / Înregistrare
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}