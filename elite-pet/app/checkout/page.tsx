'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [metodaPlata, setMetodaPlata] = useState('card');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calculăm totalul din coș pentru a-l afișa pe buton
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const suma = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    setTotal(suma);
  }, []);

  const plaseazaComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (metodaPlata === 'card') {
      // Dacă vrea cu cardul, îl trimitem la gateway-ul de plată!
      window.location.href = '/plata';
    } else {
      // Dacă e ramburs, e gata direct
      alert("Comanda a fost plasată cu plata la livrare!");
      localStorage.removeItem('cart');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#183251] p-4 text-white text-center shadow-md">
        <Link href="/" className="text-2xl font-black text-green-400">elite<span className="text-orange-500">pet</span></Link>
      </nav>

      <div className="max-w-3xl mx-auto bg-white p-8 mt-10 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Detalii Livrare & Plată</h1>
        
        <form onSubmit={plaseazaComanda} className="space-y-6">
          {/* Câmpuri adrese (scurtate pentru vizibilitate) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Telefon Contact</label><input required type="tel" className="w-full border p-2.5 rounded-lg" placeholder="07xx xxx xxx" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Oraș</label><input required type="text" className="w-full border p-2.5 rounded-lg" placeholder="București" /></div>
          </div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Adresă completă</label><textarea required rows={2} className="w-full border p-2.5 rounded-lg" placeholder="Strada..."></textarea></div>

          {/* METODE DE PLATĂ */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-800 mb-3">Metodă de Plată</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="plata" value="card" checked={metodaPlata === 'card'} onChange={() => setMetodaPlata('card')} className="w-5 h-5 text-green-600 accent-green-600" />
                <span className="font-semibold text-gray-700">Card Bancar (Redirecționare securizată)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="plata" value="ramburs" checked={metodaPlata === 'ramburs'} onChange={() => setMetodaPlata('ramburs')} className="w-5 h-5 text-green-600 accent-green-600" />
                <span className="font-semibold text-gray-700">Ramburs (La curier)</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 rounded-xl shadow-md transition">
            {metodaPlata === 'card' ? `Către Plata Online (${total} Lei)` : `Finalizează Comanda (${total} Lei)`}
          </button>
        </form>
      </div>
    </div>
  );
}