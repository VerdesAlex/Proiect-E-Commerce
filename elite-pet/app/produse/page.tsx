// app/produse/page.tsx
'use client'
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient'; 

const getSafeImage = (url: string) => (url && url.length > 5 ? url : 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80');

function CatalogContent() {
  const searchParams = useSearchParams();
  const categorieDinLink = searchParams.get('categorie') || 'toate';

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stările pentru filtrele noi și vechi
  const [selectedCategory, setSelectedCategory] = useState(categorieDinLink);
  const [selectedBrand, setSelectedBrand] = useState('toate');
  const [maxPrice, setMaxPrice] = useState(500);
  const [searchQuery, setSearchQuery] = useState(''); // Starea pentru barele de căutare
  
  const [showToast, setShowToast] = useState(false);

  // Extragem brand-urile unice din produsele descărcate
  const availableBrands = React.useMemo(() => {
    // Căutăm atât `Brand` cât și `brand` pentru a preveni erorile de litere mari/mici
    const brandsSet = new Set(products.map(p => p.Brand || p.brand).filter(Boolean));
    return ['toate', ...Array.from(brandsSet)];
  }, [products]);

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Eroare Supabase:", error.message);
      } else if (data) {
        setProducts(data);
        setFiltered(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Logica MASIVĂ de filtrare (Categorie + Brand + Preț + Căutare text)
  useEffect(() => {
    let rezultat = products;
    
    // Filtru categorie
    if (selectedCategory !== 'toate') {
      rezultat = rezultat.filter(p => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    
    // Filtru brand
    if (selectedBrand !== 'toate') {
      rezultat = rezultat.filter(p => {
        const productBrand = p.Brand || p.brand || '';
        return productBrand.toLowerCase() === selectedBrand.toLowerCase();
      });
    }

    // Filtru Căutare (Bara de Search)
    if (searchQuery.trim() !== '') {
      rezultat = rezultat.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    }

    // Filtru preț
    rezultat = rezultat.filter(p => p.price <= maxPrice);
    
    setFiltered(rezultat);
  }, [selectedCategory, selectedBrand, maxPrice, searchQuery, products]);

  const addToCart = (productToAdd: any) => {
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

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans relative">
      
      {/* NAVBAR CU SEARCH BAR INTEGRAT */}
      <nav className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <Link href="/" className="text-3xl font-black tracking-tighter text-green-600 shrink-0">elite<span className="text-orange-500">pet</span></Link>
          
          {/* Bara de Căutare Globală (Ascunsă pe mobil pentru a nu strica design-ul, vizibilă pe restul) */}
          <div className="hidden md:block flex-grow max-w-lg mx-4 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută în tot magazinul (ex: hrana, zgarda, Royal Canin)..." 
              className="w-full border-2 border-gray-200 rounded-full py-2.5 px-5 focus:outline-none focus:border-green-600 transition text-sm font-bold text-gray-700 bg-gray-50 focus:bg-white"
            />
            <span className="absolute right-4 top-2.5 text-gray-400 text-lg">🔍</span>
          </div>

          <Link href="/cos" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow transition shrink-0">🛒 Coșul Meu</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6 mt-4">
        
        {/* SIDEBAR - Filtre */}
        <aside className="w-full md:w-1/4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm h-fit">
          
          {/* SEARCH BARA SIDEBAR (Vizibilă mereu, sincronizată cu cea de sus) */}
          <div className="mb-6 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută un produs..." 
              className="w-full border-2 border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:border-green-600 transition text-sm font-bold text-gray-700"
            />
          </div>

          <h2 className="font-bold text-lg mb-4 border-b pb-2 text-black">Filtrează Produsele</h2>
          
          <div className="mb-6">
            <h3 className="font-bold text-black mb-3">Categorie</h3>
            <div className="space-y-3 text-sm text-gray-800 font-semibold">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === 'toate'} onChange={() => setSelectedCategory('toate')} className="w-4 h-4 text-green-600 accent-green-600" />
                <span>Toate produsele</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === 'caini'} onChange={() => setSelectedCategory('caini')} className="w-4 h-4 text-green-600 accent-green-600" />
                <span>Câini</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === 'pisici'} onChange={() => setSelectedCategory('pisici')} className="w-4 h-4 text-green-600 accent-green-600" />
                <span>Pisici</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="cat" checked={selectedCategory === 'pasari'} onChange={() => setSelectedCategory('pasari')} className="w-4 h-4 text-green-600 accent-green-600" />
                <span>Păsări</span>
              </label>
            </div>
          </div>

          {/* NOUL FILTRU DE BRAND (Generat Dinamic) */}
          <div className="mb-6">
            <h3 className="font-bold text-black mb-3">Brand</h3>
            {/* Folosim overflow-y-auto ca să nu se lungească pagina prea mult dacă ai 20 de brand-uri */}
            <div className="space-y-3 text-sm text-gray-800 font-semibold max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {availableBrands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="brand" 
                    checked={selectedBrand === brand} 
                    onChange={() => setSelectedBrand(brand)} 
                    className="w-4 h-4 text-green-600 accent-green-600" 
                  />
                  <span className="capitalize">{brand === 'toate' ? 'Toate brandurile' : brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-black mb-3">Preț Maxim: <span className="text-green-600">{maxPrice} Lei</span></h3>
            <input 
              type="range" min="10" max="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 font-bold mt-1">
              <span>10 Lei</span><span>500 Lei</span>
            </div>
          </div>
        </aside>

        {/* REZULTATE PRODUSE */}
        <section className="w-full md:w-3/4">
          <h1 className="text-2xl font-black text-black mb-6">Catalog Produse ({filtered.length} rezultate)</h1>
          
          {loading ? <div className="text-center font-bold text-green-600 text-xl">Se încarcă magazinul...</div> : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map(product => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition flex flex-col overflow-hidden">
                  <div className="h-40 w-full p-2 flex justify-center items-center relative">
                    {/* Afișare mică a brandului pe poză */}
                    {(product.Brand || product.brand) && (
                      <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 opacity-70">
                        {product.Brand || product.brand}
                      </span>
                    )}
                    <img src={getSafeImage(product.image_url)} alt={product.name} className="max-h-full object-contain" />
                  </div>
                  <div className="p-3 flex flex-col flex-grow border-t border-gray-50">
                    <h3 className="font-bold text-xs text-black line-clamp-2 mb-3 h-8">{product.name}</h3>
                    <div className="mt-auto">
                      <p className="text-green-600 font-black text-sm text-center mb-2">{product.price} Lei</p>
                      
                      {/* BUTON DETALII REPARAT CU window.location PENTRU NAVIGARE INSTANTANEE */}
                      <button 
                        onClick={() => window.location.href = `/produs?id=${product.id}`}
                        className="w-full block text-center border-2 border-gray-300 hover:bg-gray-100 text-black text-xs font-bold py-1.5 rounded mb-2 transition"
                      >
                        🔍 Detalii
                      </button>

                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded shadow-sm transition"
                      >
                        🛒 Adaugă
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Mesaj în caz că filtrele sunt prea stricte */}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 font-bold">
                  Nu am găsit niciun produs care să corespundă criteriilor tale de căutare. 🐾
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl font-bold flex items-center space-x-3 z-50 animate-bounce">
          <span className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
          <span>Produs adăugat în coș!</span>
        </div>
      )}

    </div>
  );
}

export default function ProdusePage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Se încarcă catalogul...</div>}><CatalogContent /></Suspense>;
}