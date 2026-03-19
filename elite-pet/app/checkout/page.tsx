'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/SupabaseClient'; // AM ADĂUGAT IMPORTUL SUPABASE AICI

export default function CheckoutPage() {
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [adresa, setAdresa] = useState('');

  const [metodaPlata, setMetodaPlata] = useState('card');
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [toast, setToast] = useState<{show: boolean, type: 'success' | 'error', message: string}>({ 
    show: false, 
    type: 'success', 
    message: '' 
  });

  useEffect(() => {
    // 1. Preluăm coșul
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    const suma = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    setTotal(suma);

    // 2. NOU: Preluăm automat datele utilizatorului conectat
    async function fetchUserData() {
      // Verificăm sesiunea curentă din Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Dacă e logat, îi completăm emailul automat
        setEmail(user.email || '');
      } else {
        // Fallback: Dacă cumva ai salvat datele doar în localStorage în sesiunile trecute
        const localEmail = localStorage.getItem('userEmail');
        if (localEmail) setEmail(localEmail);
      }

      // Verificăm dacă are și numele salvat în localStorage (cum am văzut în pagina principală)
      const localName = localStorage.getItem('userName');
      if (localName && localName !== 'Client') {
        setNume(localName);
      }
    }
    
    fetchUserData();
  }, []);

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type, message: '' });
    }, 5000); 
  };

  const plaseazaComanda = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nume || !email || !adresa || cartItems.length === 0) {
      showToastMessage('error', 'Te rugăm să completezi datele și să ai produse în coș!');
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nume,
          email: email,
          items: cartItems,
          total: total
        }),
      });
    } catch (error) {
      console.error("Eroare la trimiterea emailului:", error);
    }

    if (metodaPlata === 'card') {
      window.location.href = '/plata';
    } else {
      showToastMessage('success', 'Comanda a fost plasată! Verifică-ți emailul. 🐾');
      localStorage.removeItem('cart');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 relative">
      <nav className="bg-[#183251] p-4 text-white text-center shadow-md">
        <Link href="/" className="text-2xl font-black tracking-tighter text-green-400">elite<span className="text-orange-500">pet</span></Link>
        <p className="text-sm text-blue-200 mt-1 font-bold">Finalizare Comandă</p>
      </nav>

      <div className="max-w-3xl mx-auto mt-8 p-4">
        <form onSubmit={plaseazaComanda} className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-800 mb-4">Date de Livrare</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nume Complet</label>
                <input 
                  type="text" 
                  required
                  value={nume}
                  onChange={(e) => setNume(e.target.value)}
                  className="w-full border border-gray-300 text-gray-900 font-semibold focus:border-green-500 focus:ring-1 focus:ring-green-500 p-2.5 rounded-lg outline-none transition" 
                  placeholder="ex: Ion Popescu" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email (Aici vei primi confirmarea)</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 text-gray-900 font-semibold focus:border-green-500 focus:ring-1 focus:ring-green-500 p-2.5 rounded-lg outline-none transition" 
                  placeholder="ex: ion@email.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
                <input 
                  type="tel" 
                  required
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  className="w-full border border-gray-300 text-gray-900 font-semibold focus:border-green-500 focus:ring-1 focus:ring-green-500 p-2.5 rounded-lg outline-none transition" 
                  placeholder="07xx xxx xxx" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adresă Completă</label>
                <textarea 
                  required
                  value={adresa}
                  onChange={(e) => setAdresa(e.target.value)}
                  className="w-full border border-gray-300 text-gray-900 font-semibold focus:border-green-500 focus:ring-1 focus:ring-green-500 p-2.5 rounded-lg outline-none transition min-h-[100px]" 
                  placeholder="Strada, Număr, Bloc, Apartament, Oraș, Județ..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-800 mb-4">Metodă de Plată</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <input type="radio" name="plata" value="card" checked={metodaPlata === 'card'} onChange={() => setMetodaPlata('card')} className="w-5 h-5 text-green-600 accent-green-600" />
                <span className="font-bold text-gray-800">💳 Card Bancar (Redirecționare securizată)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <input type="radio" name="plata" value="ramburs" checked={metodaPlata === 'ramburs'} onChange={() => setMetodaPlata('ramburs')} className="w-5 h-5 text-green-600 accent-green-600" />
                <span className="font-bold text-gray-800">🚚 Ramburs (La sosirea curierului)</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || total === 0}
            className={`w-full text-white font-black py-4 rounded-xl shadow-lg text-lg transition-transform transform hover:-translate-y-1 ${
              isSubmitting || total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Se procesează...' : `Confirmă Comanda de ${total} Lei`}
          </button>
          
        </form>
      </div>

      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center space-x-3 z-50 animate-bounce ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
          <span className={`${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'} rounded-full w-6 h-6 flex items-center justify-center text-sm`}>
            {toast.type === 'error' ? '!' : '✓'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}