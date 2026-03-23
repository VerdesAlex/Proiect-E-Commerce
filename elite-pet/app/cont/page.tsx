'use client'
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// AM ȘTERS IMPORTURILE DIRECTE DE jspdf ȘI html2canvas DE AICI!

function ContulMeuContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParam || 'date');
  const [userName, setUserName] = useState('Client');
  const [userEmail, setUserEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [animals, setAnimals] = useState<any[]>([]);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<any>({}); 

  const [showInvoice, setShowInvoice] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      setUserName(localStorage.getItem('userName') || 'Client');
      setUserEmail(localStorage.getItem('userEmail') || 'client@email.com');
      
      const savedAnimals = localStorage.getItem('petsDataList');
      if (savedAnimals) {
        setAnimals(JSON.parse(savedAnimals));
      } else {
        setAnimals([{
          id: 1,
          name: 'Max',
          type: 'Câine',
          breed: 'Bulldog Francez',
          dob: '2023-05-12',
          weight: '12',
          allergies: 'Alergie pui'
        }]);
      }
    }
    setMounted(true);
  }, []);

  const handleSaveAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    let newAnimals;
    if (currentAnimal.id) {
      newAnimals = animals.map(a => a.id === currentAnimal.id ? currentAnimal : a);
    } else {
      newAnimals = [...animals, { ...currentAnimal, id: Date.now() }];
    }
    setAnimals(newAnimals);
    localStorage.setItem('petsDataList', JSON.stringify(newAnimals));
    setShowAnimalForm(false);
  };

  const handleDeleteAnimal = (id: number) => {
    if(confirm("Ești sigur că vrei să ștergi acest animal din contul tău?")) {
      const newAnimals = animals.filter(a => a.id !== id);
      setAnimals(newAnimals);
      localStorage.setItem('petsDataList', JSON.stringify(newAnimals));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href='/';
  };

  // FUNCȚIA REPARATĂ: IMPORTĂM DINAMIC LIBRĂRIILE DOAR LA CLICK
  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Magia Next.js: Importăm modulele doar pe partea de client, în momentul rulării
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Factura_EP_9024_${userName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Eroare generare PDF:", error);
      alert("A apărut o eroare la descărcarea PDF-ului.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (mounted && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black text-black mb-4">Nu ești autentificat!</h2>
        <Link href="/register" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold">Mergi la Autentificare</Link>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans relative">
      <div className="print:hidden">
        
        <nav className="bg-white p-4 shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-black tracking-tight text-green-600">elite<span className="text-orange-500">pet</span></Link>
            
            <div className="flex items-center space-x-6">
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
              <Link href="/cos" className="text-sm font-bold text-black hover:text-green-600 transition">🛒 Coșul Meu</Link>
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

        <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-[#183251] text-white">
                <h2 className="font-black text-xl">Salut, {userName.split(' ')[0]}!</h2>
                <p className="text-sm font-bold opacity-90">Membru ElitePet</p>
              </div>
              <div className="flex flex-col">
                <button onClick={() => setActiveTab('date')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'date' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>👤 Date Personale</button>
                <button onClick={() => setActiveTab('animal')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'animal' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>🐾 Animalele Mele</button>
                <button onClick={() => setActiveTab('comenzi')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'comenzi' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>📦 Comenzile Mele</button>
                <button onClick={() => setActiveTab('retur')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'retur' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>🔄 Retururi</button>
                <button onClick={handleLogout} className="p-4 text-left font-bold text-sm text-red-600 hover:bg-red-50 transition border-l-4 border-transparent mt-4 border-t border-gray-200">🚪 Deconectare</button>
              </div>
            </div>
          </aside>

          <main className="w-full md:w-3/4">
            {activeTab === 'date' && (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-black text-black mb-6 border-b border-gray-200 pb-4">Date Personale</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-black text-black mb-2">Nume Complet</label><input type="text" defaultValue={userName} className="w-full border-2 border-gray-300 p-3 rounded-lg text-black font-bold outline-none" /></div>
                  <div><label className="block text-sm font-black text-black mb-2">Email</label><input type="email" defaultValue={userEmail} disabled className="w-full border-2 border-gray-200 bg-gray-50 p-3 rounded-lg text-black font-bold outline-none" /></div>
                </div>
                <button className="mt-8 bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition">Salvează Modificările</button>
              </div>
            )}

            {activeTab === 'animal' && (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-black text-black">Animalele Mele</h2>
                  {!showAnimalForm && (
                    <button 
                      onClick={() => {
                        setCurrentAnimal({ name: '', type: '', breed: '', dob: '', weight: '', allergies: '' });
                        setShowAnimalForm(true);
                      }} 
                      className="text-green-700 font-bold text-sm hover:underline border border-green-200 bg-green-50 px-3 py-1.5 rounded transition hover:bg-green-100"
                    >
                      + Adaugă animal nou
                    </button>
                  )}
                </div>
                
                {showAnimalForm ? (
                  <form onSubmit={handleSaveAnimal} className="bg-orange-50 p-6 rounded-xl border border-orange-200 animate-fade-in">
                    <h3 className="font-black text-lg mb-4 text-orange-800">{currentAnimal.id ? 'Editează Profilul' : 'Adaugă Profil Nou'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block font-bold text-black text-sm mb-1">Numele Animalului</label><input required type="text" value={currentAnimal.name || ''} onChange={e => setCurrentAnimal({...currentAnimal, name: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Specie (ex: Câine, Pisică)</label><input required type="text" value={currentAnimal.type || ''} onChange={e => setCurrentAnimal({...currentAnimal, type: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Rasă</label><input type="text" value={currentAnimal.breed || ''} onChange={e => setCurrentAnimal({...currentAnimal, breed: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Data Nașterii</label><input type="date" value={currentAnimal.dob || ''} onChange={e => setCurrentAnimal({...currentAnimal, dob: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Greutate (kg)</label><input type="number" value={currentAnimal.weight || ''} onChange={e => setCurrentAnimal({...currentAnimal, weight: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Alergii/Sensibilități</label><input type="text" value={currentAnimal.allergies || ''} onChange={e => setCurrentAnimal({...currentAnimal, allergies: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded shadow transition">Salvează Datele</button>
                      <button type="button" onClick={() => setShowAnimalForm(false)} className="bg-white border border-gray-300 hover:bg-gray-100 text-black font-bold py-2 px-6 rounded transition">Anulează</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {animals.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-500 font-bold mb-4">Nu ai adăugat niciun animal încă.</p>
                      </div>
                    ) : (
                      animals.map((animal) => (
                        <div key={animal.id} className="bg-orange-50 rounded-xl p-6 border-2 border-orange-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden transition hover:border-orange-300">
                          
                          <div className="absolute top-4 right-4 flex gap-2 z-20">
                            <button onClick={() => { setCurrentAnimal(animal); setShowAnimalForm(true); }} className="bg-white px-3 py-1.5 rounded shadow-sm text-xs font-bold border border-gray-200 hover:bg-blue-50 hover:text-blue-700 transition">✏️ Editează</button>
                            <button onClick={() => handleDeleteAnimal(animal.id)} className="bg-white px-3 py-1.5 rounded shadow-sm text-xs font-bold border border-gray-200 text-red-500 hover:bg-red-50 transition">🗑️</button>
                          </div>

                          <div className="absolute -right-4 -top-4 text-9xl opacity-5 pointer-events-none">🐾</div>
                          
                          <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80" alt={animal.name} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white shadow-md z-10" />
                          
                          <div className="flex-1 text-center md:text-left z-10 w-full mt-4 md:mt-0">
                            <h3 className="text-2xl md:text-3xl font-black text-orange-600 mb-1">{animal.name}</h3>
                            <p className="text-black font-bold mb-4">{animal.type} • {animal.breed}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                              <div><p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase">Data Nașterii</p><p className="font-black text-black">{animal.dob || '-'}</p></div>
                              <div><p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase">Greutate</p><p className="font-black text-black">{animal.weight ? `${animal.weight} kg` : '-'}</p></div>
                              <div><p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase">Sensibilități</p><p className="font-black text-red-600 truncate">{animal.allergies || 'Niciuna'}</p></div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comenzi' && (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-black text-black mb-6 border-b border-gray-200 pb-4">Istoric Comenzi</h2>
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 transition">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="font-black text-black text-lg">Comanda #EP-9024</span>
                        <p className="text-sm text-gray-800 font-bold">Plasată pe 10 Martie 2026</p>
                      </div>
                      <span className="bg-green-100 text-green-900 text-xs font-black px-3 py-1 rounded-full uppercase border border-green-300">Livrată</span>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t border-gray-200">
                      <p className="text-sm text-black font-bold">2 produse</p>
                      <p className="font-black text-black text-xl">345,00 Lei</p>
                    </div>
                    <button onClick={() => setShowInvoice(true)} className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 font-bold text-sm px-4 py-2 rounded hover:bg-blue-100 transition">📄 Vezi factura & Detalii</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'retur' && (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-black text-black mb-6 border-b pb-4">Retururi</h2>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center mb-6">
                  <h3 className="text-lg font-black text-black mb-2">Vrei să returnezi un produs?</h3>
                  <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded shadow mt-2">Inițiază Retur Nou</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* AM ADĂUGAT INLINE STYLES (HEX) PENTRU CULORI PENTRU A PREVENI EROAREA LAB() */}
            <div ref={invoiceRef} style={{ backgroundColor: '#ffffff', color: '#000000' }}>
              <div style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #d1d5db' }} className="p-6 flex justify-between items-start">
                <div><h2 className="text-2xl font-black" style={{ color: '#000000' }}>Factură Fiscală</h2><p className="font-bold text-sm mt-1" style={{ color: '#000000' }}>Seria EP Nr. 9024</p></div>
                <div className="text-right font-bold text-sm" style={{ color: '#000000' }}><p>Data: 10/03/2026</p><p>Status: <span style={{ color: '#16a34a' }}>Achitată</span></p></div>
              </div>
              <div className="p-6 font-mono text-sm" style={{ color: '#000000' }}>
                <div className="flex justify-between pb-4 mb-4" style={{ borderBottom: '2px solid #000000' }}>
                  <div><p className="font-black text-base uppercase">Furnizor:</p><p className="font-bold">ElitePet SRL</p><p>CUI: RO12345678</p><p>București, România</p></div>
                  <div className="text-right"><p className="font-black text-base uppercase">Client:</p><p className="font-bold">{userName}</p><p>{userEmail}</p></div>
                </div>
                <table className="w-full text-left border-collapse mb-6">
                  <thead><tr style={{ borderBottom: '1px solid #9ca3af' }}><th className="py-2 font-black">Produs</th><th className="py-2 font-black text-center">Cant.</th><th className="py-2 font-black text-right">Preț unitar</th><th className="py-2 font-black text-right">Total</th></tr></thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}><td className="py-3 font-bold">Hrană uscată Câini Purina Pro Plan</td><td className="py-3 text-center font-bold">1</td><td className="py-3 text-right font-bold">289.00 Lei</td><td className="py-3 text-right font-bold">289.00 Lei</td></tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}><td className="py-3 font-bold">Zgardă reflectorizantă M</td><td className="py-3 text-center font-bold">1</td><td className="py-3 text-right font-bold">56.00 Lei</td><td className="py-3 text-right font-bold">56.00 Lei</td></tr>
                  </tbody>
                </table>
                <div className="flex justify-end text-base">
                  <div className="w-full md:w-1/2">
                    <div className="flex justify-between py-1 font-bold" style={{ borderBottom: '1px solid #e5e7eb' }}><p>Subtotal:</p><p>345.00 Lei</p></div>
                    <div className="flex justify-between py-1 font-bold" style={{ borderBottom: '1px solid #e5e7eb' }}><p>Transport:</p><p>0.00 Lei</p></div>
                    <div className="flex justify-between py-2 text-xl font-black mt-2 px-2 rounded" style={{ backgroundColor: '#f3f4f6' }}><p>TOTAL DE PLATĂ:</p><p>345.00 Lei</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTOANELE RĂMÂN LA FEL, ELE NU INTRĂ ÎN PDF */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4 mt-auto">
              <button onClick={downloadPDF} disabled={isGeneratingPDF} className={`text-white px-6 py-2 rounded font-bold transition flex items-center space-x-2 ${isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                <span>{isGeneratingPDF ? 'Se generează...' : '⬇️ Descarcă PDF'}</span>
              </button>
              <button onClick={() => setShowInvoice(false)} className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded font-bold transition">Închide</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function ContulMeu() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">Se încarcă contul...</div>}>
      <ContulMeuContent />
    </Suspense>
  );
}