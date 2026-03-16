// app/cont/page.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ContulMeu() {
  const [activeTab, setActiveTab] = useState('date');
  const [userName, setUserName] = useState('Client');
  const [userEmail, setUserEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isEditingAnimal, setIsEditingAnimal] = useState(false);
  const [animal, setAnimal] = useState({
    name: 'Max',
    type: 'Câine',
    breed: 'Bulldog Francez',
    dob: '2023-05-12',
    weight: '12',
    allergies: 'Alergie pui'
  });

  const [showInvoice, setShowInvoice] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Ref-ul pentru a "prinde" zona facturii pe care vrem să o facem PDF
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      setUserName(localStorage.getItem('userName') || 'Client');
      setUserEmail(localStorage.getItem('userEmail') || 'client@email.com');
      
      const savedAnimal = localStorage.getItem('petData');
      if (savedAnimal) {
        setAnimal(JSON.parse(savedAnimal));
      }
    }
    setMounted(true);
  }, []);

  const handleSaveAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('petData', JSON.stringify(animal));
    setIsEditingAnimal(false);
  };

  // FUNCȚIA PENTRU DESCĂRCAREA AUTOMATĂ A PDF-ULUI
  const downloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    setIsGeneratingPDF(true); // Arătăm un "loading" pe buton

    try {
      // 1. Facem "poza" clară a div-ului
      const canvas = await html2canvas(element, {
        scale: 2, // Calitate mai bună
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // 2. Creăm documentul PDF (A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // 3. Lipim imaginea și salvăm
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Factura_EP_9024_${userName.replace(/\s+/g, '_')}.pdf`); // Numele descărcării
      
    } catch (error) {
      console.error("Eroare la generarea PDF-ului", error);
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
            <Link href="/cos" className="text-sm font-bold text-black hover:text-green-600 transition">🛒 Coșul Meu</Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4 flex flex-col md:flex-row gap-8">
          {/* MENIU LATERAL */}
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-[#183251] text-white">
                <h2 className="font-black text-xl">Salut, {userName.split(' ')[0]}!</h2>
                <p className="text-sm font-bold opacity-90">Membru ElitePet</p>
              </div>
              <div className="flex flex-col">
                <button onClick={() => setActiveTab('date')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'date' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>👤 Date Personale</button>
                <button onClick={() => setActiveTab('animal')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'animal' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>🐾 Animalul Meu</button>
                <button onClick={() => setActiveTab('comenzi')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'comenzi' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>📦 Comenzile Mele</button>
                <button onClick={() => setActiveTab('retur')} className={`p-4 text-left font-bold text-sm transition border-l-4 ${activeTab === 'retur' ? 'border-green-600 bg-gray-50 text-green-700' : 'border-transparent text-gray-800 hover:bg-gray-50 hover:text-black'}`}>🔄 Retururi</button>
                <button onClick={() => { localStorage.removeItem('isLoggedIn'); window.location.href='/'; }} className="p-4 text-left font-bold text-sm text-red-600 hover:bg-red-50 transition border-l-4 border-transparent mt-4 border-t border-gray-200">🚪 Deconectare</button>
              </div>
            </div>
          </aside>

          {/* CONȚINUT PRINCIPAL */}
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
                  <h2 className="text-2xl font-black text-black">Profilul Animalului</h2>
                  {!isEditingAnimal && (
                    <button onClick={() => setIsEditingAnimal(true)} className="text-blue-700 font-bold text-sm hover:underline border border-blue-200 bg-blue-50 px-3 py-1 rounded">✏️ Editează profilul</button>
                  )}
                </div>
                
                {isEditingAnimal ? (
                  <form onSubmit={handleSaveAnimal} className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block font-bold text-black text-sm mb-1">Numele Animalului</label><input required type="text" value={animal.name} onChange={e => setAnimal({...animal, name: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Specie (ex: Câine, Pisică)</label><input required type="text" value={animal.type} onChange={e => setAnimal({...animal, type: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Rasă</label><input type="text" value={animal.breed} onChange={e => setAnimal({...animal, breed: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Data Nașterii</label><input type="date" value={animal.dob} onChange={e => setAnimal({...animal, dob: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Greutate (kg)</label><input type="number" value={animal.weight} onChange={e => setAnimal({...animal, weight: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                      <div><label className="block font-bold text-black text-sm mb-1">Alergii/Sensibilități</label><input type="text" value={animal.allergies} onChange={e => setAnimal({...animal, allergies: e.target.value})} className="w-full p-2 border-2 border-orange-200 rounded font-bold text-black outline-none" /></div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded shadow">Salvează Datele</button>
                      <button type="button" onClick={() => setIsEditingAnimal(false)} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded">Anulează</button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80" alt={animal.name} className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md z-10" />
                    <div className="flex-1 text-center md:text-left z-10">
                      <h3 className="text-3xl font-black text-orange-600 mb-1">{animal.name}</h3>
                      <p className="text-black font-bold mb-4">{animal.type} • {animal.breed}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                        <div><p className="text-xs text-gray-500 font-bold uppercase">Data Nașterii</p><p className="font-black text-black">{animal.dob || 'Nespecificat'}</p></div>
                        <div><p className="text-xs text-gray-500 font-bold uppercase">Greutate</p><p className="font-black text-black">{animal.weight} kg</p></div>
                        <div><p className="text-xs text-gray-500 font-bold uppercase">Sensibilități</p><p className="font-black text-red-600">{animal.allergies || 'Niciuna'}</p></div>
                      </div>
                    </div>
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
                    <button 
                      onClick={() => setShowInvoice(true)} 
                      className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 font-bold text-sm px-4 py-2 rounded hover:bg-blue-100 transition"
                    >
                      📄 Vezi factura & Detalii
                    </button>
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

      {/* POP-UP FACTURĂ - CU REF-UL PENTRU DESCĂRCARE */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* ZONA CAPTURATĂ DE PDF (invoiceRef) */}
            <div ref={invoiceRef} className="bg-white">
              {/* Header Factură */}
              <div className="bg-gray-100 p-6 border-b border-gray-300 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-black">Factură Fiscală</h2>
                  <p className="text-black font-bold text-sm mt-1">Seria EP Nr. 9024</p>
                </div>
                <div className="text-right text-black font-bold text-sm">
                  <p>Data: 10/03/2026</p>
                  <p>Status: <span className="text-green-600">Achitată</span></p>
                </div>
              </div>

              {/* Corp Factură */}
              <div className="p-6 font-mono text-sm text-black">
                <div className="flex justify-between border-b-2 border-black pb-4 mb-4">
                  <div>
                    <p className="font-black text-base uppercase">Furnizor:</p>
                    <p className="font-bold">ElitePet SRL</p>
                    <p>CUI: RO12345678</p>
                    <p>București, România</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-base uppercase">Client:</p>
                    <p className="font-bold">{userName}</p>
                    <p>{userEmail}</p>
                  </div>
                </div>

                <table className="w-full text-left border-collapse mb-6">
                  <thead>
                    <tr className="border-b border-gray-400">
                      <th className="py-2 font-black">Produs</th>
                      <th className="py-2 font-black text-center">Cant.</th>
                      <th className="py-2 font-black text-right">Preț unitar</th>
                      <th className="py-2 font-black text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-bold">Hrană uscată Câini Purina Pro Plan</td>
                      <td className="py-3 text-center font-bold">1</td>
                      <td className="py-3 text-right font-bold">289.00 Lei</td>
                      <td className="py-3 text-right font-bold">289.00 Lei</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-bold">Zgardă reflectorizantă M</td>
                      <td className="py-3 text-center font-bold">1</td>
                      <td className="py-3 text-right font-bold">56.00 Lei</td>
                      <td className="py-3 text-right font-bold">56.00 Lei</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end text-base">
                  <div className="w-full md:w-1/2">
                    <div className="flex justify-between border-b border-gray-200 py-1 font-bold"><p>Subtotal:</p><p>345.00 Lei</p></div>
                    <div className="flex justify-between border-b border-gray-200 py-1 font-bold"><p>Transport:</p><p>0.00 Lei</p></div>
                    <div className="flex justify-between py-2 text-xl font-black mt-2 bg-gray-100 px-2 rounded"><p>TOTAL DE PLATĂ:</p><p>345.00 Lei</p></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Butoane Acțiune (Astea NU apar in PDF, pentru ca sunt in afara ref-ului) */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4 mt-auto">
              <button 
                onClick={downloadPDF} 
                disabled={isGeneratingPDF}
                className={`text-white px-6 py-2 rounded font-bold transition flex items-center space-x-2 ${isGeneratingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                <span>{isGeneratingPDF ? 'Se generează...' : '⬇️ Descarcă PDF'}</span>
              </button>
              <button onClick={() => setShowInvoice(false)} className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded font-bold transition">
                Închide
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}