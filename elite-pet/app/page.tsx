'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from '../lib/SupabaseClient';
import ProductCarousel from '../components/ProductCarousel';

const MapWithNoSSR = dynamic(() => import('../components/Map'), { ssr: false, loading: () => <p className="p-4 text-gray-500">Harta se încarcă...</p> });

// Am adăugat 'category' aici pentru a-l putea folosi opțional la filtrare
interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Stările pentru Banner-ul Aniversar Dinamic
  const [isBirthday, setIsBirthday] = useState(false);
  const [petName, setPetName] = useState('');

  // --- STĂRI NOI PENTRU LIVE SEARCH ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

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
    // 1. Verificăm dacă există o sesiune activă în Supabase
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        // Tragem automat numele din contul de Google (sau prima parte din email)
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Client';
        setUserName(name);
        
        // Sincronizăm cu localStorage pentru ca restul site-ului să meargă la fel ca înainte
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        if(user.email) localStorage.setItem('userEmail', user.email);
      } else {
        // Fallback pentru vechiul sistem
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
        setUserName(localStorage.getItem('userName') || 'Client');
      }

      // Verificăm ziua de naștere a animalelor doar dacă utilizatorul este logat
      if (user || localStorage.getItem('isLoggedIn') === 'true') {
        const savedAnimals = localStorage.getItem('petsDataList');
        if (savedAnimals) {
          try {
            const animalsList = JSON.parse(savedAnimals);
            const birthdayPet = animalsList.find((pet: any) => {
               if (!pet.dob) return false;
               const dobMonth = new Date(pet.dob).getMonth();
               const currentMonth = new Date().getMonth();
               return dobMonth === currentMonth;
            });

            if (birthdayPet) {
              setIsBirthday(true);
              setPetName(birthdayPet.name);
            }
          } catch (error) {
            console.error("Eroare la citirea datelor animalelor:", error);
          }
        }
      }
    };

    checkUser();

    // 2. Ascultăm automat redirecționarea de la Google
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Client';
        setUserName(name);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        if(session.user.email) localStorage.setItem('userEmail', session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserName('');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
      }
    });

    // Curățăm listener-ul când plecăm de pe pagină
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. Modificăm Logout-ul ca să taie și conexiunea cu Google/Supabase
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Deconectare reală din backend
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsBirthday(false);
  };

  // Descărcarea produselor la montarea paginii
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
          console.error('Eroare Supabase:', error.message);
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

  // --- LOGICA PENTRU LIVE SEARCH ---
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      // Filtrăm rapid din memoria locală (produsele deja descărcate)
      const results = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Tăiem lista la maxim 5 rezultate ca să nu iasă din ecran
      
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery, products]);

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
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 gap-4">
          
          <div className="flex items-center space-x-2 shrink-0">
            <Link href="/" className="text-3xl font-black tracking-tighter text-green-600">elite<span className="text-orange-500">pet</span></Link>
            <span className="text-xs text-gray-400 hidden lg:block ml-2 mt-2">magazin online</span>
          </div>

          {/* BARA DE CĂUTARE GLOBALĂ CU SUGESTII */}
          <div className="hidden md:block flex-grow max-w-lg relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 3 && setShowDropdown(true)}
              // Timeout mic pentru a permite click-ului pe dropdown să se execute înainte să dispară lista
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} 
              placeholder="Caută produse (ex: Royal Canin, Jucarie)..." 
              className="w-full border-2 border-gray-200 rounded-full py-2.5 px-5 focus:outline-none focus:border-green-600 transition text-sm font-bold text-gray-700 bg-gray-50 focus:bg-white"
            />
            <span className="absolute right-4 top-2.5 text-gray-400 text-lg">🔍</span>

            {/* DROPDOWN SUGESTII */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map(product => (
                      <li key={product.id} className="border-b border-gray-50 last:border-0">
                        <button 
                          onClick={() => window.location.href = `/produs?id=${product.id}`}
                          className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 transition"
                        >
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 object-contain rounded" />
                          <div className="flex-grow">
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-green-600 font-black">{product.price} Lei</p>
                          </div>
                        </button>
                      </li>
                    ))}
                    <li className="bg-gray-50 p-2 text-center border-t border-gray-100">
                      <Link href={`/produse?categorie=toate`} className="text-xs font-bold text-green-600 hover:underline">
                        Apasă Enter pentru toate rezultatele &rarr;
                      </Link>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 font-bold">
                    Nu am găsit produse pentru "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 shrink-0">
            {isLoggedIn ? (
               <div className="hidden sm:block relative group py-2"> 
                 <Link href="/cont?tab=date" className="text-sm font-bold text-green-600 hover:text-green-800 transition pb-1 cursor-pointer flex items-center gap-1">
                   <span>👤 Salut, {userName.split(' ')[0]}!</span>
                   <span className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform duration-300">▼</span>
                 </Link>
                 
                 <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                   <div className="p-4 bg-[#183251] text-white">
                     <p className="font-black text-sm truncate">{userName}</p>
                     <p className="text-xs font-medium text-blue-200 mt-0.5">Membru ElitePet</p>
                   </div>
                   <ul className="flex flex-col py-2">
                     <li><Link href="/cont?tab=date" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">👤 Date Personale</Link></li>
                     <li><Link href="/cont?tab=animal" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">🐾 Animalele Mele</Link></li>
                     <li><Link href="/cont?tab=comenzi" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">📦 Istoric Comenzi</Link></li>
                     <li><Link href="/cont?tab=retur" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-bold transition">🔄 Retururi</Link></li>
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

      {/* Bannere Promoționale */}
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

      {/* 3 Beneficii */}
      <section className="max-w-7xl mx-auto mt-8 px-4 md:px-6 border-b border-gray-300 pb-8 hidden md:block">
        <div className="text-center mb-6">
          <span className="bg-[#F4F5F7] px-4 text-gray-500 text-sm font-semibold relative top-[10px]">Numărul meu 1 în articole pentru animale</span>
          <hr className="border-gray-300" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600 text-xl">🔄</div>
            <div><p className="font-bold text-gray-800 text-sm">Economisește 5% la comenzi</p><p className="text-xs text-gray-500">cu abonament Autoship</p></div>
          </div>
          <div className="flex items-center space-x-4 border-l border-gray-100 pl-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 text-xl">⭐</div>
            <div><p className="font-bold text-gray-800 text-sm">Câștigă mai multe recompense</p><p className="text-xs text-gray-500">Înregistrează-te gratuit</p></div>
          </div>
          <div className="flex items-center space-x-4 border-l border-gray-100 pl-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-xl">📱</div>
            <div><p className="font-bold text-gray-800 text-sm">Ai 25 lei reducere in APP</p><p className="text-xs text-gray-500">Descarcă aplicația acum</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-12 mt-4">
        
        {/* Carusel */}
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

        {/* Harta */}
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

      {/* FOOTER */}
      <footer className="bg-[#183251] text-white pt-12 pb-6 border-t-4 border-green-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-blue-900 pb-8">
          <div><Link href="/" className="text-3xl font-black tracking-tighter text-green-400">elite<span className="text-orange-500">pet</span></Link><p className="text-blue-200 text-sm mt-4 font-medium leading-relaxed">Pasiunea noastră este fericirea animalului tău de companie. Oferim cele mai bune produse, la cele mai bune prețuri, cu livrare rapidă.</p></div>
          <div><h3 className="font-bold text-lg mb-4 text-white">Informații Utile</h3><ul className="space-y-2 text-sm text-blue-200 font-medium"><li><Link href="/despre" className="hover:text-green-400 transition">Despre Noi</Link></li><li><Link href="/contact" className="hover:text-green-400 transition">Contact & Suport</Link></li><li><Link href="/legal" className="hover:text-green-400 transition">Termeni și Condiții (Date Legale)</Link></li><li><Link href="/legal" className="hover:text-green-400 transition">Politica de Confidențialitate</Link></li><li><Link href="/cont" className="hover:text-green-400 transition">Contul Meu / Retur</Link></li></ul></div>
          <div><h3 className="font-bold text-lg mb-4 text-white">Contact & Program</h3><ul className="space-y-2 text-sm text-blue-200 font-medium"><li className="flex items-center space-x-2"><span>📞</span> <span>0712 345 678</span></li><li className="flex items-center space-x-2"><span>✉️</span> <span>salut@elitepet.ro</span></li><li className="flex items-center space-x-2"><span>📍</span> <span>Bd. Unirii nr. 10, București</span></li></ul><div className="mt-4 bg-blue-900/50 p-3 rounded-lg border border-blue-800"><h4 className="text-xs font-black text-green-400 uppercase mb-1">Program Suport:</h4><p className="text-xs text-blue-100 font-bold">Luni - Vineri: 09:00 - 18:00</p><p className="text-xs text-blue-100 font-bold">Sâmbătă: 10:00 - 14:00</p></div></div>
          <div><h3 className="font-bold text-lg mb-4 text-white">Protecția Consumatorului</h3><div className="space-y-3 flex flex-col"><a href="https://anpc.ro/" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition"><span className="text-black font-black text-xs">ANPC - SAL</span></a><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition"><span className="text-black font-black text-xs">SOL - Litigii Online</span></a><a href="https://www.anaf.ro/" target="_blank" rel="noreferrer" className="block border border-gray-400 bg-white p-2 rounded flex items-center justify-center hover:bg-gray-100 transition mt-2"><span className="text-blue-900 font-black text-xs">A.N.A.F.</span></a></div></div>
        </div>
        <div className="text-center text-xs text-blue-400 font-bold">&copy; {new Date().getFullYear()} ElitePet SRL. Toate drepturile rezervate. Proiect pentru facultate.</div>
      </footer>
    </main>
  );
}