'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from '../lib/SupabaseClient';
import ProductCarousel from '../components/ProductCarousel';

const MapWithNoSSR = dynamic(() => import('../components/Map'), { ssr: false, loading: () => <p className="p-4 text-gray-500">Harta se încarcă...</p> });

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Stări noi pentru banner-ul de zi de naștere
  const [isBirthday, setIsBirthday] = useState(false);
  const [petName, setPetName] = useState('');

  // Funcția de adăugare în coș
  const addToCart = (productToAdd: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = existingCart.findIndex((item: any) => item.id === productToAdd.id);
    
    if (itemIndex >= 0) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ 
        id: productToAdd.id, 
        name: productToAdd.name, 
        price: productToAdd.price, 
        image_url: productToAdd.image_url,
        quantity: 1 
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setUserName(localStorage.getItem('userName') || 'Client');

    // LOGICA PENTRU ZIUA DE NAȘTERE A ANIMALULUI
    if (loggedIn) {
      const savedAnimal = localStorage.getItem('petData');
      if (savedAnimal) {
        try {
          const animalData = JSON.parse(savedAnimal);
          if (animalData.dob && animalData.name) {
            // Extragem luna nașterii și luna curentă
            const dobMonth = new Date(animalData.dob).getMonth();
            const currentMonth = new Date().getMonth();
            
            // Dacă lunile coincid, activăm bannerul!
            if (dobMonth === currentMonth) {
              setIsBirthday(true);
              setPetName(animalData.name);
            }
          }
        } catch (error) {
          console.error("Eroare la citirea datelor animalului:", error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setIsBirthday(false); // Ascundem bannerul dacă iese din cont
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        
        if (error) {
          console.error('Eroare la extragerea Supabase:', error.message);
          setProducts([]);
        } else if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Eroare neașteptată:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#F4F5F7] font-sans">
      
      {/* Banner Aniversar Dinamic */}
      {isBirthday && (
        <div className="bg-yellow-400 px-4 py-1.5 text-center text-yellow-900 font-semibold text-xs border-b border-yellow-500 tracking-wide animate-fade-in">
          🎉 Sărbătorim luna de naștere! La mulți ani, <span className="font-black text-black">{petName}</span>! Ai 20% REDUCERE la jucării cu codul: <span className="font-black text-black">{petName.toUpperCase().replace(/\s/g, '')}20</span>
        </div>
      )}

      {/* Header Principal */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-3xl font-black tracking-tighter text-green-600">elite<span className="text-orange-500">pet</span></Link>
            <span className="text-xs text-gray-400 hidden md:block ml-2 mt-2">magazin online pentru animale</span>
          </div>
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
            
            <div className="text-sm font-semibold text-gray-600 hidden sm:block border-l border-gray-300 pl-4">
              ZooPoints: <span className="text-orange-500 font-bold">120</span>
            </div>
            
            <Link href="/cos" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition flex items-center">
              🛒 Coșul Meu
            </Link>
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

      {/* Bannere Promoționale Mari */}
      <section className="max-w-7xl mx-auto mt-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-white flex flex-col justify-center shadow-md relative overflow-hidden">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 z-10">zoodays</h2>
            <p className="text-xl md:text-2xl font-bold z-10">PÂNĂ LA 40% REDUCERE</p>
            <span className="absolute top-4 right-4 bg-white text-rose-600 text-xs font-black px-2 py-1 rounded">12-16 MARTIE</span>
            <div className="absolute right-[-20px] bottom-[-40px] opacity-20 text-[150px]">🐾</div>
          </div>
          <div className="bg-rose-500 rounded-2xl p-6 text-white flex flex-col justify-center shadow-md">
            <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight">Ai 25 lei reducere la prima comandă în APP</h3>
            <div className="mt-4 bg-rose-700 w-max px-3 py-1 rounded text-sm font-bold border border-rose-400">Cod: APP-NEW</div>
          </div>
        </div>
      </section>

      {/* Cele 3 beneficii */}
      <section className="max-w-7xl mx-auto mt-8 px-4 md:px-6 border-b border-gray-300 pb-8 hidden md:block">
        <div className="text-center mb-6">
          <span className="bg-[#F4F5F7] px-4 text-gray-500 text-sm font-semibold relative top-[10px]">Numărul meu 1 în articole pentru animale</span>
          <hr className="border-gray-300" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600 text-xl">🔄</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Economisește 5% la comenzi</p>
              <p className="text-xs text-gray-500">cu abonament Autoship</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-l border-gray-100 pl-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 text-xl">⭐</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Câștigă mai multe recompense</p>
              <p className="text-xs text-gray-500">Înregistrează-te gratuit</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-l border-gray-100 pl-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-xl">📱</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Ai 25 lei reducere in APP</p>
              <p className="text-xs text-gray-500">Descarcă aplicația acum</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-12 mt-4">
        
        {/* Bloc A: Catalog Produse (Carusel Infinit cu Săgeți) */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-3xl font-black text-black">Recomandate pentru tine</h2>
            <Link href="/produse" className="text-blue-700 font-bold text-sm hover:underline hidden md:block">Vezi toate produsele &rarr;</Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
            </div>
          ) : (
            <ProductCarousel products={products} addToCart={addToCart} />
          )}
        </section>

        {/* Bloc E: Harta */}
        <section className="pb-12 mt-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Magazine & Click&Collect</h2>
          <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm relative z-0">
            <MapWithNoSSR />
          </div>
        </section>

      </div>
      
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center space-x-3 z-50 animate-bounce">
          <span className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
          <span>Produs adăugat în coș!</span>
        </div>
      )}

      {/* SUBSOL (FOOTER) COMPLET */}
      <footer className="bg-[#183251] text-white pt-12 pb-6 border-t-4 border-green-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-blue-900 pb-8">
          <div>
            <Link href="/" className="text-3xl font-black tracking-tighter text-green-400">elite<span className="text-orange-500">pet</span></Link>
            <p className="text-blue-200 text-sm mt-4 font-medium leading-relaxed">
              Pasiunea noastră este fericirea animalului tău de companie. Oferim cele mai bune produse, la cele mai bune prețuri, cu livrare rapidă.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Informații Utile</h3>
            <ul className="space-y-2 text-sm text-blue-200 font-medium">
              <li><Link href="/despre" className="hover:text-green-400 transition">Despre Noi</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition">Contact & Suport</Link></li>
              <li><Link href="/legal" className="hover:text-green-400 transition">Termeni și Condiții (Date Legale)</Link></li>
              <li><Link href="/legal" className="hover:text-green-400 transition">Politica de Confidențialitate</Link></li>
              <li><Link href="/cont" className="hover:text-green-400 transition">Contul Meu / Retur</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contact & Program</h3>
            <ul className="space-y-2 text-sm text-blue-200 font-medium">
              <li className="flex items-center space-x-2"><span>📞</span> <span>0712 345 678</span></li>
              <li className="flex items-center space-x-2"><span>✉️</span> <span>salut@elitepet.ro</span></li>
              <li className="flex items-center space-x-2"><span>📍</span> <span>Bd. Unirii nr. 10, București</span></li>
            </ul>
            <div className="mt-4 bg-blue-900/50 p-3 rounded-lg border border-blue-800">
              <h4 className="text-xs font-black text-green-400 uppercase mb-1">Program Suport:</h4>
              <p className="text-xs text-blue-100 font-bold">Luni - Vineri: 09:00 - 18:00</p>
              <p className="text-xs text-blue-100 font-bold">Sâmbătă: 10:00 - 14:00</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Protecția Consumatorului</h3>
            <div className="space-y-3 flex flex-col">
              <a href="https://anpc.ro/" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition">
                <span className="text-black font-black text-xs">ANPC - SAL</span>
              </a>
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition">
                <span className="text-black font-black text-xs">SOL - Litigii Online</span>
              </a>
              <a href="https://www.anaf.ro/" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition mt-2">
                 <span className="text-blue-900 font-black text-xs">A.N.A.F.</span>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-blue-400 font-bold">
          &copy; {new Date().getFullYear()} ElitePet SRL. Toate drepturile rezervate. Proiect pentru facultate.
        </div>
      </footer>
    </main>
  );
}