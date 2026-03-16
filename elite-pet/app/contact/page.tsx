'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Client');

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    setUserName(localStorage.getItem('userName') || 'Client');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mesajul tău a fost trimis cu succes! Te vom contacta în curând.");
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col">
      {/* NAVBAR COMPLET */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-3xl font-black tracking-tighter text-green-600">elite<span className="text-orange-500">pet</span></Link>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            {isLoggedIn ? (
               <div className="hidden sm:block relative group py-2"> 
                 <Link href="/cont" className="text-sm font-bold text-green-600 hover:text-green-800 transition pb-1 cursor-pointer flex items-center gap-1">
                   <span>👤 Salut, {userName.split(' ')[0]}!</span>
                   <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform duration-300">▼</span>
                 </Link>
                 <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                   <div className="p-4 bg-[#183251] text-white">
                     <p className="font-black text-sm truncate">{userName}</p>
                     <p className="text-xs font-medium text-blue-200 mt-0.5">Membru ElitePet</p>
                   </div>
                   <ul className="flex flex-col py-2">
                     <li><Link href="/cont" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">👤 Date Personale</Link></li>
                     <li><Link href="/cont" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">🐾 Animalul Meu</Link></li>
                     <li><Link href="/cont" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">📦 Istoric Comenzi</Link></li>
                     <li><Link href="/cont" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">🔄 Retururi</Link></li>
                     <li className="border-t border-gray-100 mt-2 pt-2">
                       <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition">🚪 Deconectare</button>
                     </li>
                   </ul>
                 </div>
               </div>
            ) : (
               <Link href="/register" className="text-sm font-bold text-gray-500 hover:text-green-600 hidden sm:block">👤 Intră în cont</Link>
            )}
            <Link href="/cos" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition flex items-center">🛒 Coșul Meu</Link>
          </div>
        </div>

        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex space-x-8 text-sm font-bold text-gray-700 p-3 overflow-x-auto">
            <Link href="/produse?categorie=caini" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Câini</Link>
            <Link href="/produse?categorie=pisici" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Pisici</Link>
            <Link href="/produse?categorie=pasari" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Păsări</Link>
            <Link href="/produse" className="hover:text-green-600 border-b-2 border-transparent hover:border-green-600 pb-1 whitespace-nowrap">Toate Produsele</Link>
          </div>
        </div>
      </nav>

      {/* CONȚINUT PAGINĂ */}
      <div className="flex-grow max-w-5xl mx-auto p-6 mt-8 mb-12">
        <h1 className="text-4xl font-black text-black mb-8 text-center">Contact & Suport</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-black mb-6 text-black">Trimite-ne un mesaj</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-bold mb-1 text-black">Numele tău</label><input required type="text" className="w-full border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-green-500 text-black font-bold" placeholder="Ex: Ion Popescu" /></div>
              <div><label className="block text-sm font-bold mb-1 text-black">Email</label><input required type="email" className="w-full border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-green-500 text-black font-bold" placeholder="adresa@email.com" /></div>
              <div><label className="block text-sm font-bold mb-1 text-black">Mesajul tău</label><textarea required rows={4} className="w-full border-2 border-gray-300 p-3 rounded-lg outline-none focus:border-green-500 text-black font-bold" placeholder="Cu ce te putem ajuta?"></textarea></div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-md transition">Trimite Mesajul</button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-[#183251] text-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-xl font-black mb-6 border-b border-blue-800 pb-4">Informații Contact</h2>
              <div className="space-y-4 font-bold">
                <p className="flex items-center text-lg"><span className="text-2xl mr-4">📞</span> 0712 345 678</p>
                <p className="flex items-center text-lg"><span className="text-2xl mr-4">✉️</span> salut@elitepet.ro</p>
                <p className="flex items-center text-lg"><span className="text-2xl mr-4">📍</span> Bd. Unirii nr. 10, Sector 3, București</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-black text-black mb-2">Program de funcționare:</h3>
              <ul className="text-gray-700 font-bold space-y-1">
                <li className="flex justify-between"><span>Luni - Vineri:</span> <span>09:00 - 18:00</span></li>
                <li className="flex justify-between"><span>Sâmbătă:</span> <span>10:00 - 14:00</span></li>
                <li className="flex justify-between text-red-600"><span>Duminică:</span> <span>Închis</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER COMPLET */}
      <footer className="bg-[#183251] text-white pt-12 pb-6 border-t-4 border-green-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-blue-900 pb-8">
          <div><Link href="/" className="text-3xl font-black tracking-tighter text-green-400">elite<span className="text-orange-500">pet</span></Link><p className="text-blue-200 text-sm mt-4 font-medium leading-relaxed">Pasiunea noastră este fericirea animalului tău de companie. Oferim cele mai bune produse, la cele mai bune prețuri, cu livrare rapidă.</p></div>
          <div><h3 className="font-bold text-lg mb-4 text-white">Informații Utile</h3><ul className="space-y-2 text-sm text-blue-200 font-medium"><li><Link href="/despre" className="hover:text-green-400 transition">Despre Noi</Link></li><li><Link href="/contact" className="hover:text-green-400 transition">Contact & Suport</Link></li><li><Link href="/legal" className="hover:text-green-400 transition">Termeni și Condiții (Date Legale)</Link></li><li><Link href="/legal" className="hover:text-green-400 transition">Politica de Confidențialitate</Link></li><li><Link href="/cont" className="hover:text-green-400 transition">Contul Meu / Retur</Link></li></ul></div>
          <div><h3 className="font-bold text-lg mb-4 text-white">Contact & Program</h3><ul className="space-y-2 text-sm text-blue-200 font-medium"><li className="flex items-center space-x-2"><span>📞</span> <span>0712 345 678</span></li><li className="flex items-center space-x-2"><span>✉️</span> <span>salut@elitepet.ro</span></li><li className="flex items-center space-x-2"><span>📍</span> <span>Bd. Unirii nr. 10, București</span></li></ul><div className="mt-4 bg-blue-900/50 p-3 rounded-lg border border-blue-800"><h4 className="text-xs font-black text-green-400 uppercase mb-1">Program Suport:</h4><p className="text-xs text-blue-100 font-bold">Luni - Vineri: 09:00 - 18:00</p><p className="text-xs text-blue-100 font-bold">Sâmbătă: 10:00 - 14:00</p></div></div>
          <div><h3 className="font-bold text-lg mb-4 text-white">Protecția Consumatorului</h3><div className="space-y-3 flex flex-col"><a href="https://anpc.ro/" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition"><span className="text-black font-black text-xs">ANPC - SAL</span></a><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition"><span className="text-black font-black text-xs">SOL - Litigii Online</span></a><a href="https://www.anaf.ro/" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition mt-2"><span className="text-blue-900 font-black text-xs">A.N.A.F.</span></a></div></div>
        </div>
        <div className="text-center text-xs text-blue-400 font-bold">&copy; {new Date().getFullYear()} ElitePet SRL. Toate drepturile rezervate. Proiect pentru facultate.</div>
      </footer>
    </div>
  );
}