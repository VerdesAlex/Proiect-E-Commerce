import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Inițializăm Resend cu cheia din .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Extragem datele primite de la pagina de checkout
    const { name, email, items, total } = await request.json();

    // Creăm o listă HTML cu produsele din coș
    const itemsHtml = items.map((item: any) => 
      `<li style="margin-bottom: 10px;">
        <strong>${item.quantity}x ${item.name}</strong> - ${item.price} Lei
      </li>`
    ).join('');

    // Trimitem emailul
    const data = await resend.emails.send({
      from: 'ElitePet <onboarding@resend.dev>', // Adresa de test oferită de Resend
      to: email, // Aici, pentru test, va trebui să folosești emailul tău personal
      subject: 'Confirmare Comandă - ElitePet 🐾',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">elite<span style="color: #f97316;">pet</span></h1>
            <p style="margin: 5px 0 0 0;">Magazinul preferat al animalului tău!</p>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #16a34a;">Salutare, ${name}! 🎉</h2>
            <p>Îți mulțumim pentru comanda plasată la ElitePet. Ne apucăm imediat să pregătim produsele pentru a ajunge cât mai repede la tine.</p>
            
            <h3 style="border-bottom: 2px solid #eee; padding-bottom: 5px; mt-4">Rezumatul Comenzii:</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              ${itemsHtml}
            </ul>
            
            <div style="background-color: #f4f5f7; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h3 style="margin: 0; text-align: right; color: #16a34a;">Total de plată: ${total} Lei</h3>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Dacă ai întrebări despre comanda ta, ne poți contacta oricând răspunzând la acest email.
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}