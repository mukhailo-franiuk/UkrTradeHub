import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, Truck, Calendar, CreditCard, ArrowRight, User } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  // Якщо ID замовлення взагалі немає в URL-адресі
  if (!orderId) {
    notFound();
  }

  // Витягуємо замовлення з бази даних разом із купленими варіантами товарів
  const order = await (prisma as any).order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: { title: true }
              }
            }
          }
        }
      }
    }
  });

  // Якщо замовлення з таким ID не існує в базі Neon
  if (!order) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center p-4 font-sans text-slate-200">
        <div className="text-center bg-[#111827]/40 border border-slate-800/80 rounded-3xl p-8 max-w-md w-full">
          <span className="text-4xl block mb-3">⚠️</span>
          <h1 className="text-base font-black uppercase tracking-tight text-white mb-2">Замовлення не знайдено</h1>
          <p className="text-xs text-slate-400 font-mono mb-6">Схоже, сталася помилка або замовлення ще не встигло записатися в базу даних.</p>
          <Link href="/" className="w-full block py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-200 hover:bg-slate-800 transition-all">
            На головну
          </Link>
        </div>
      </div>
    );
  }

  // Форматуємо дату для відображення
  const orderDate = new Date(order.createdAt).toLocaleString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl min-h-screen bg-[#070a13] text-slate-200 font-sans pb-24">
      <div className="space-y-6">
        
        {/* ГОЛОВНА ПЛАШКА ПОДЯКИ */}
        <div className="bg-[#111827]/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Дякуємо за покупку!</h1>
            <p className="text-xs text-slate-400 font-mono">Замовлення успішно сформоване в системі маркетплейсу</p>
          </div>
          <div className="inline-block bg-slate-950 px-4 py-2 border border-slate-900 rounded-2xl text-xs font-mono">
            Номер замовлення: <span className="text-amber-400 font-black uppercase">{order.id.substring(0, 8)}</span>
          </div>
        </div>

        {/* ДЕТАЛІ ЗАМОВЛЕННЯ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Стан оплати та дата */}
          <div className="bg-[#111827]/30 border border-slate-800/60 rounded-2xl p-4 space-y-3">
            <h3 className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-500" /> Інформація
            </h3>
            <div className="text-xs space-y-1.5 font-mono">
              <p className="text-slate-400">Дата: <span className="text-slate-200 font-bold">{orderDate}</span></p>
              <p className="text-slate-400">Тип: <span className="text-slate-200 font-bold">{order.paymentMethod}</span></p>
              <p className="text-slate-400 flex items-center gap-1.5">
                Статус: 
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  order.isPaid || order.status === "PAID"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                }`}>
                  {order.isPaid || order.status === "PAID" ? "ОПЛАЧЕНО" : "ОЧІКУЄ ОПЛАТИ / ПІДТВЕРДЖЕННЯ"}
                </span>
              </p>
            </div>
          </div>

          {/* Доставка */}
          <div className="bg-[#111827]/30 border border-slate-800/60 rounded-2xl p-4 space-y-3">
            <h3 className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider flex items-center gap-1.5">
              <Truck size={12} className="text-slate-500" /> Дані доставки
            </h3>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        {/* СПИСОК КУПЛЕНИХ ТОВАРІВ (ЕЛЕКТРОННИЙ ЧЕК) */}
        <div className="bg-[#111827]/40 border border-slate-800/80 rounded-3xl p-5 space-y-4">
          <h3 className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
            <ShoppingBag size={12} className="text-slate-500" /> Товари в чеку
          </h3>
          
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-start gap-4 text-xs font-mono bg-slate-950/40 p-3 rounded-xl border border-slate-900/60">
                <div className="space-y-1">
                  <h4 className="text-slate-200 font-bold line-clamp-1">
                    {item.variant?.product?.title || "Куплений товар"}
                  </h4>
                  <p className="text-[10px] text-slate-500">Кількість: {item.quantity} шт.</p>
                </div>
                <span className="text-slate-300 font-black shrink-0">
                  {Number(item.price) * item.quantity} ₴
                </span>
              </div>
            ))}
          </div>

          {/* РАЗОМ ДО ОПЛАТИ */}
          <div className="pt-4 border-t border-slate-900 flex flex-col items-end space-y-1.5 font-mono text-xs">
            {Number(order.discountAmount) > 0 && (
              <p className="text-slate-500">Знижка: <span className="text-rose-400 font-bold">-{Number(order.discountAmount)} ₴</span></p>
            )}
            <p className="text-slate-400 text-sm">
              Разом: <span className="text-base font-black text-amber-400">{Number(order.totalAmount)} ₴</span>
            </p>
            <p className="text-[10px] text-emerald-400/80">
              Нараховано кешбеку: +{Number(order.cashbackEarned)} ₴
            </p>
          </div>
        </div>

        {/* НАВІГАЦІЯ НАЗАД НА САЙТ */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link href="/" className="w-full sm:flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 select-none active:scale-[0.99]">
            Продовжити покупки
          </Link>
          <Link href="/dashboard/vendor/orders" className="w-full sm:flex-1 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 select-none active:scale-[0.99]">
            <span>В кабінет замовлень</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </main>
  );
}
