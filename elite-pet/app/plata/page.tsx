// app/plata/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PaymentGateway() {
  const [total, setTotal] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const suma = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    setTotal(suma);
    setMounted(true);
  }, []);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);

    setTimeout(() => {
      const cleanCard = cardNumber.replace(/\s/g, ''); 
      if (cleanCard.startsWith('4242') || cleanCard.startsWith('4111')) {
        setIsSuccess(true);
        localStorage.removeItem('cart'); 
      } else {
        setErrorMsg('Tranzacție respinsă. Folosiți cardul de test: 4242 4242 4242 4242');
        setIsProcessing(false);
      }
    }, 2000); 
  };

  if (!mounted) return null; 

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-lg border-t-8 border-green-500">
          <div className="text-7xl mb-6">✅</div>
          <h2 className="text-3xl font-black text-black mb-2">Plată Confirmată!</h2>
          <p className="text-black mb-8 font-bold">Tranzacția a fost procesată cu succes.</p>
          <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">Întoarce-te la Magazin</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-gray-200">
        
        <div className="bg-[#183251] p-6 text-center text-white relative">
          <div className="absolute top-4 left-4 text-xs opacity-70">🔒 Secure Payment</div>
          <h2 className="text-xl font-bold mt-2">ElitePet SRL Gateway</h2>
          <p className="opacity-90 text-sm font-bold">Suma de plată:</p>
          <h1 className="text-4xl font-black">{total} RON</h1>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-3 mb-4 text-sm font-bold">
              {errorMsg}
            </div>
          )}

          {/* TEXTUL AICI E ACUM NEGRU/ALBASTRU INCHIS */}
          <div className="bg-blue-50 text-blue-900 p-4 rounded-lg text-sm mb-6 font-bold border-2 border-blue-200 flex items-start">
            <span className="text-2xl mr-2">ℹ️</span>
            <div>
              Mediu de Testare Activ. <br/>
              Pentru validare folosiți cardul: <span className="font-mono bg-white px-2 py-1 border border-blue-300 rounded text-black select-all">4242 4242 4242 4242</span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-sm font-black text-black mb-1">Număr Card</label>
              <input 
                required 
                type="text" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border-2 border-gray-300 p-3 rounded-md font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-bold" 
                placeholder="0000 0000 0000 0000" 
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-black mb-1">Data expirării</label>
                <input required type="text" className="w-full border-2 border-gray-300 p-3 rounded-md font-mono focus:ring-2 focus:ring-blue-500 outline-none text-black font-bold" placeholder="LL/AA" />
              </div>
              <div>
                <label className="block text-sm font-black text-black mb-1">CVC / CVV</label>
                <input required type="password" className="w-full border-2 border-gray-300 p-3 rounded-md font-mono focus:ring-2 focus:ring-blue-500 outline-none text-black font-bold" placeholder="123" maxLength={3} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-4 rounded-md font-black text-lg transition shadow-md mt-4 text-white ${isProcessing ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#0070ba] hover:bg-[#005ea6]'}`}
            >
              {isProcessing ? 'Se procesează...' : `Plătește ${total} RON Securizat`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}