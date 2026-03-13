'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [trimis, setTrimis] = useState(false);

  const plaseazaComanda = (e: React.FormEvent) => {
    e.preventDefault();
    setTrimis(true);
  };

  if (trimis) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Comanda a fost plasată!</h2>
          <p className="text-gray-600 mb-8">Îți mulțumim! Produsele tale vor ajunge la tine în 24-48 de ore.</p>
          <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">Întoarce-te Acasă</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#183251] p-4 text-white text-center shadow-md">
        <Link href="/" className="text-2xl font-black text-green-400">elite<span className="text-orange-500">pet</span></Link>
      </nav>

      <div className="max-w-3xl mx-auto bg-white p-8 mt-10 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Detalii Livrare & Plată</h1>
        
        <form onSubmit={plaseazaComanda} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Telefon Contact</label>
              <input required type="tel" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="07xx xxx xxx" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Oraș</label>
              <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Ex: București" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Adresă completă de livrare</label>
            <textarea required rows={3} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Strada, Număr, Bloc, Scara..."></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-800 mb-3">Metodă de Plată</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="plata" defaultChecked className="w-5 h-5 text-green-600 accent-green-600" />
                <span className="font-semibold text-gray-700">Card Bancar (Online)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="radio" name="plata" className="w-5 h-5 text-green-600 accent-green-600" />
                <span className="font-semibold text-gray-700">Ramburs (La livrare)</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 rounded-xl shadow-md transition">
            Finalizează Comanda - 259,00 Lei
          </button>
        </form>
      </div>
    </div>
  );
}