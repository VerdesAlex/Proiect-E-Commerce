import { useState, useEffect } from 'react';

export default function BirthdayBanner({ pets }) {
  const [isBirthdayMonth, setIsBirthdayMonth] = useState(false);
  const [petName, setPetName] = useState('');

  useEffect(() => {
    if (pets && pets.length > 0) {
      const currentMonth = new Date().getMonth();
      // Verificăm dacă vreun animal are ziua luna asta
      const celebratingPet = pets.find(p => new Date(p.birth_date).getMonth() === currentMonth);
      
      if (celebratingPet) {
        setIsBirthdayMonth(true);
        setPetName(celebratingPet.name);
      }
    }
  }, [pets]);

  if (!isBirthdayMonth) return null;

  return (
    <div className="bg-yellow-400 p-4 text-center font-bold border-b-4 border-yellow-600 animate-pulse">
      🎉 La mulți ani, {petName}! Ai 20% REDUCERE la jucării folosind codul: {petName}20 🎂
    </div>
  );
}