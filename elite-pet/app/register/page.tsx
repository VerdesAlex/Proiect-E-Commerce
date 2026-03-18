// app/register/page.tsx
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/SupabaseClient'; // Importăm Supabase!

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Adăugăm un state de loading

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (isLogin) {
      // --- LOG IN LOGIC (SUPABASE) ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMsg(error.message === 'Invalid login credentials' ? 'Email sau parolă incorectă!' : error.message);
        setIsLoading(false);
        return;
      }

      // Logare cu succes! Salvăm datele local ca să funcționeze restul site-ului
      const userMetadata = data.user?.user_metadata;
      localStorage.setItem('userName', userMetadata?.full_name || 'Client');
      localStorage.setItem('userEmail', data.user?.email || email);
      localStorage.setItem('isLoggedIn', 'true');
      
      window.location.href = '/';

    } else {
      // --- REGISTER LOGIC (SUPABASE) ---
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name, // Salvăm numele în Supabase metadata
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      // Înregistrare cu succes! 
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isLoggedIn', 'true');
      
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-200 shadow-sm p-4 text-center">
        <Link href="/" className="text-3xl font-black text-green-600 tracking-tighter">elite<span className="text-orange-500">pet</span></Link>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
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

          <div className="p-8">
            <h2 className="text-2xl font-black text-black mb-2 text-center">
              {isLogin ? 'Bine ai revenit!' : 'Alătură-te comunității'}
            </h2>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm font-bold text-center">
                ⚠️ {errorMsg}
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4 mt-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Nume Complet</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 outline-none text-black font-bold transition" 
                    placeholder="Ex: Ion Popescu" 
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-black mb-1">Adresă de Email</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 outline-none text-black font-bold transition" 
                  placeholder="adresa@email.com" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">Parolă (Min. 6 caractere)</label>
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 outline-none text-black font-bold transition" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full text-white font-black py-4 rounded-xl mt-4 shadow-md transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isLoading ? 'Se procesează...' : (isLogin ? 'Autentificare' : 'Creează Contul')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}