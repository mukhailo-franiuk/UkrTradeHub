import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // ВИПРАВЛЕНО: Глобальний стабільний синглтон
import { Wallet, ShoppingBag, Heart, Sparkles, ArrowUpRight, Clock, Star } from "lucide-react";

export const revalidate = 0; // Дані завжди свіжі, без застарілого кешу

// ВИПРАВЛЕНО: Сама сторінка тепер є асинхронним серверним компонентом
export default async function BuyerDashboard() {
  // 1. Отримуємо токен із кукі на стороні сервера
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("velamarket_auth_token");
  const token = tokenCookie?.value;

  if (!token) {
    redirect("/login");
  }

  let userId = "";

  try {
    // 2. Безпечно декодуємо корисне навантаження токена (id або userId)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(jsonPayload);
    userId = payload.userId || payload.id;
  } catch (error) {
    redirect("/login");
  }

  if (!userId) {
    redirect("/login");
  }

  // 3. Запитуємо свіжі дані користувача з бази Neon PostgreSQL
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: { balanceUah: true, name: true, email: true }
  });

  const balance = userData?.balanceUah ? Number(userData.balanceUah) : 0;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* ПРЕМІАЛЬНЕ ПРИВІТАННЯ */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0f172a] to-[#111827] border border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-md text-[10px] font-black uppercase tracking-wider font-mono">
              <Sparkles className="w-3 h-3 animate-pulse" /> Покупець Vela.Club
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1">
              Вітаємо, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{userData?.name || "Користувач"}</span>!
            </h1>
            <p className="text-sm text-slate-400 font-medium">Ласкаво просимо до вашого приватного кабінету платформи VelaMarket.</p>
          </div>
          <div className="text-left md:text-right font-mono text-xs text-slate-500 bg-slate-950/40 px-4 py-2 rounded-xl border border-slate-800/40">
            ID: <span className="text-slate-300 font-bold">{userId.slice(0, 8)}...</span>
          </div>
        </div>
      </div>

      {/* МАТРИЦЯ ВІДЖЕТІВ ТА ГАМАНЦЯ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* КАРТКА ПРЕМІУМ ГАМАНЦЯ */}
        <div className="p-6 bg-gradient-to-br from-[#1e1b4b]/60 to-[#311042]/40 bg-[#0f172a] border border-amber-500/20 rounded-2xl text-white shadow-xl relative overflow-hidden group hover:border-amber-400/30 transition-all duration-300">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            <Wallet className="w-32 h-32 text-amber-400" />
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Ваш Особистий Баланс</p>
            <div className="p-2 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400"><Wallet className="w-4 h-4" /></div>
          </div>
          
          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-4xl font-black text-white font-mono tracking-tight">
              {balance.toLocaleString("uk-UA", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-xl font-bold text-amber-400 font-mono">₴</span>
          </div>
          
          {balance === 150 && (
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-amber-400/90 font-medium bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20 shadow-inner">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Вітальний бонус 150 грн активовано!
            </div>
          )}
        </div>

        {/* ЗАМОВЛЕННЯ */}
        <div className="p-6 bg-[#111827]/40 border border-slate-800/80 rounded-2xl flex items-center justify-between shadow-lg hover:border-slate-700/60 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Мої покупки</p>
              <p className="text-xl font-black text-white mt-0.5 font-mono">0 товарів</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        {/* ОБРАНЕ */}
        <div className="p-6 bg-[#111827]/40 border border-slate-800/80 rounded-2xl flex items-center justify-between shadow-lg hover:border-slate-700/60 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Закладки / Обране</p>
              <p className="text-xl font-black text-white mt-0.5 font-mono">0 лотів</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>

      {/* ДЕФОЛТНИЙ СТАН ІСТОРІЇ АКТИВНОСТІ */}
      <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <div className="border-b border-slate-800/60 pb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-black text-white uppercase tracking-wider">Останні трансакції та замовлення</h2>
        </div>
        <div className="p-12 text-center text-slate-500 text-sm max-w-sm mx-auto">
          <div className="w-10 h-10 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center text-slate-600 mx-auto mb-3 font-mono font-bold">Ø</div>
          <h3 className="font-bold text-slate-300">Історія чиста</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ви ще не робили покупок на маркетплейсі. Усі ваші майбутні чеки з'являться тут.</p>
        </div>
      </div>

    </div>
  );
}

