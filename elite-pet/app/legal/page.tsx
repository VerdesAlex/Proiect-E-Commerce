'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DateLegale() {
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
      <div className="flex-grow max-w-4xl mx-auto p-6 mt-8 mb-12">
        <h1 className="text-4xl font-black text-black mb-8 border-b-4 border-green-500 pb-4 inline-block">Date Legale & Termeni</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-black space-y-8">
          <section>
            <h2 className="text-xl font-black mb-3 text-blue-900 uppercase">1. Identitatea Companiei</h2>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm font-bold border border-gray-200">
              <p>Denumire Firmă: ELITEPET STORE S.R.L.</p>
              <p>C.U.I.: RO12345678</p>
              <p>Nr. Înreg. Reg. Comerțului: J40/1234/2020</p>
              <p>Sediu Social: Str. Câinilor Fericți nr. 1, Sector 3, București</p>
              <p>Capital Social: 200 RON</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-black mb-3 text-blue-900 uppercase">2. Termeni și Condiții Generale</h2>
            <p className="font-medium text-gray-800 leading-relaxed text-sm">Prin utilizarea acestui site web și plasarea de comenzi, utilizatorul acceptă Termenii și Condițiile stipulate. Prețurile afișate includ TVA (19% sau 9% după caz). ElitePet își rezervă dreptul de a modifica prețurile fără notificare prealabilă, însă comenzile deja plasate și confirmate nu vor fi afectate.</p>
          </section>
          <section>
            <h2 className="text-xl font-black mb-3 text-blue-900 uppercase">3. Politica de Retur (OUG 34/2014)</h2>
            <p className="font-medium text-gray-800 leading-relaxed text-sm">Conform legislației din România, consumatorul are dreptul de a denunța unilateral contractul la distanță, fără penalități și fără a invoca un motiv, în termen de <strong>14 zile calendaristice</strong> de la primirea produsului.<br/><br/>*Notă: Hrana pentru animale (uscată sau umedă) desfăcută din ambalajul original NU poate fi returnată din motive de igienă și protecție a sănătății.</p>
          </section>
          <section>
            <h2 className="text-xl font-black mb-3 text-blue-900 uppercase">4. Prelucrarea Datelor (GDPR)</h2>
            <p className="font-medium text-gray-800 leading-relaxed text-sm">Protejăm cu strictețe datele tale personale. Colectăm doar informațiile necesare pentru facturare și livrarea comenzilor. Nu vindem datele tale către terți. Prin crearea unui cont, ești de acord cu stocarea sigură a acestor informații în baza noastră de date.</p>
          </section>
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