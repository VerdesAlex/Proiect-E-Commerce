'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // States for input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for showing errors (like "Wrong Password")
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); // Reset errors

    if (isLogin) {
      // --- LOG IN LOGIC ---
      const savedEmail = localStorage.getItem('userEmail');
      const savedPassword = localStorage.getItem('userPassword');

      if (!savedEmail) {
        setErrorMsg('Acest cont nu există. Te rugăm să creezi unul.');
        return;
      }
      if (email !== savedEmail || password !== savedPassword) {
        setErrorMsg('Email sau parolă incorectă!');
        return;
      }
      // If we reach here, login is successful!
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/';

    } else {
      // --- REGISTER LOGIC ---
      // Save credentials to our "mini-database" (localStorage)
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      localStorage.setItem('isLoggedIn', 'true'); // Auto-login after register
      
      window.location.href = '/cos';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-[#183251] p-4 text-white text-center shadow-md">
        <Link href="/" className="text-3xl font-black text-green-400">elite<span className="text-orange-500">pet</span></Link>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* TABS */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => { setIsLogin(true); setErrorMsg(''); }} 
              className={`w-1/2 py-4 font-bold text-sm transition ${isLogin ? 'bg-white text-green-600 border-b-2 border-green-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              Intră în cont
            </button>
            <button 
              onClick={() => { setIsLogin(false); setErrorMsg(''); }} 
              className={`w-1/2 py-4 font-bold text-sm transition ${!isLogin ? 'bg-white text-green-600 border-b-2 border-green-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              Creare cont nou
            </button>
          </div>

          {/* FORM */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {isLogin ? 'Bine ai revenit!' : 'Alătură-te comunității'}
            </h2>

            {/* ERROR MESSAGE BOX */}
            {errorMsg && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-bold text-center">
                {errorMsg}
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4 mt-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nume Complet</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black font-medium" 
                    placeholder="Ex: Ion Popescu" 
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adresă de Email</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black font-medium" 
                  placeholder="adresa@email.com" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Parolă</label>
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black font-medium" 
                  placeholder="••••••••" 
                />
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4 shadow-md transition">
                {isLogin ? 'Autentificare' : 'Creează Contul'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}