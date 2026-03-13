'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Definim cum arată un produs în coș
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
  const [mounted, setMounted] = useState(false); // Pentru a preveni erori de afișare pe server

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    
    // Încărcăm coșul salvat în browser
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setMounted(true);
  }, []);

  // Funcție pentru a șterge un produs din coș
  const removeFromCart = (id: number) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart)); // Salvăm noul coș în browser
  };

  // Calculăm Totalul automat
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Așteptăm să se încarce datele pe client
  if (!mounted) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Se încarcă...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-[#183251] p-4 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tight text-green-400">elite<span className="text-orange-500">pet</span></Link>
          <span className="text-sm font-bold">Coșul Meu</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-6 mt-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6">Produse în coș</h1>
        
        {cartItems.length === 0 ? (
          /* DESIGN PENTRU COȘ GOL */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coșul tău este gol</h2>
            <p className="text-gray-500 mb-8">Nu ai adăugat încă niciun produs. Blănosul tău așteaptă o surpriză!</p>
            <Link href="/produse">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow transition">
                Începe cumpărăturile
              </button>
            </Link>
          </div>
        ) : (
          /* DESIGN PENTRU COȘ PLIN */
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
              
              {/* Listăm fiecare produs din coș dinamic */}
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0 gap-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-contain rounded border border-gray-200 p-1" />
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 font-semibold">Cantitate: <span className="text-black">{item.quantity}</span></p>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:text-red-700 font-bold mt-2 transition">
                        🗑️ Șterge din coș
                      </button>
                    </div>
                  </div>
                  <div className="text-lg md:text-xl font-black text-green-600 text-right">
                    {item.price * item.quantity} Lei
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-6 border-t border-gray-200 pt-6">
                <Link href="/produse" className="text-blue-600 hover:underline font-semibold mb-4 md:mb-0">
                  &larr; Continuă cumpărăturile
                </Link>
                <div className="text-right">
                  <p className="text-gray-600 mb-1">Subtotal: {total} Lei</p>
                  <p className="text-sm text-gray-500 mb-2 border-b border-gray-100 pb-2">Transport: <span className="font-bold text-green-600">Calculat la finalizare</span></p>
                  <h2 className="text-2xl font-black text-gray-800">Total: {total} Lei</h2>
                </div>
              </div>
            </div>

            {/* LOGICA BUTONULUI DE CHECKOUT */}
            <div className="text-right bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              {isLoggedIn ? (
                <Link href="/checkout">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl shadow-md transition text-lg w-full md:w-auto">
                    Pasul Următor: Livrare & Plată &rarr;
                  </button>
                </Link>
              ) : (
                <div className="flex flex-col items-end">
                  <p className="text-red-500 font-bold mb-3">⚠️ Trebuie să fii autentificat pentru a comanda.</p>
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