import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles, Star } from "lucide-react";
import Button from "../components/ui/Button";
import SectionHeading from "../components/ui/SectionHeading";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { categories } from "../data/categories";
import { productService } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    productService
      .list({ size: 60 })
      .then((res) => active && setProducts(res.items))
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const pick = (tag, n = 4) => {
    const tagged = products.filter((p) => p.tag === tag);
    return tagged.concat(products).slice(0, n);
  };
  const newArrivals = pick("New");
  const bestSellers = pick("Best Seller");

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-[--color-cream]">
        <div className="container-luxe grid md:grid-cols-2 gap-10 lg:gap-16 py-16 md:py-24 items-center">
          <div className="flex flex-col gap-6 animate-fade-up">
            <span className="eyebrow">The Summer Edit · 2026</span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-[--color-ink]">
              Summer
              <br />
              <span className="italic text-[--color-bronze-700]">Arrivals.</span>
            </h1>

            <p className="text-[--color-mist] max-w-md text-[15px]">
              Considered tailoring, breathable linens and quietly luxurious
              essentials — for warmer days, slower mornings, and longer evenings.
            </p>
            <div className="flex flex-wrap gap-3 mt-1">
              <Button as={Link} to="/products?cat=women" variant="primary" size="lg">
                Shop the Edit
              </Button>
              <Button as={Link} to="/products?cat=men" variant="outline" size="lg">
                Explore Men
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-3 text-[--color-mist] text-xs">
              <span className="flex items-center gap-1.5"><Sparkles size={14} /> Free shipping over $200</span>
              <span className="hidden sm:flex items-center gap-1.5"><RotateCcw size={14} /> 30-day returns</span>
            </div>
          </div>

          <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-sm overflow-hidden shadow-[--shadow-lift]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80&auto=format"
              alt="Mercantix Summer 2026 editorial"
              wrapperClassName="absolute inset-0"
              className="absolute inset-0 h-full w-full object-cover"
              eager
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-[--color-ivory]/95 backdrop-blur px-5 py-4 flex items-center justify-between rounded-sm">
              <div>
                <p className="font-display text-lg text-[--color-ink]">The Linen Edit</p>
                <p className="text-xs text-[--color-mist]">12 new pieces · From $78</p>
              </div>
              <Link
                to="/products?cat=women"
                className="grid h-9 w-9 place-items-center rounded-full bg-[--color-ink] text-[--color-ivory] hover:bg-[--color-bronze-700]"
                aria-label="Shop The Linen Edit"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY TRIO */}
      <section className="container-luxe py-20">
        <SectionHeading
          eyebrow="Shop by Category"
          title="The Edit"
          subtitle="Curated departments — every piece considered, every category essential."
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              to={`/products?cat=${c.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-[--color-cream]"
            >
              <ImageWithFallback
                src={c.image}
                alt={c.label}
                wrapperClassName="absolute inset-0"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 text-[--color-ivory]">
                <p className="text-[11px] tracking-[0.22em] uppercase opacity-80">{c.blurb}</p>
                <h3 className="font-display text-3xl mt-1">{c.label}</h3>
                <span className="inline-flex items-center gap-1.5 mt-3 text-xs tracking-[0.16em] uppercase border-b border-[--color-ivory]/70 pb-0.5">
                  Discover <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-luxe py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeading
            align="left"
            eyebrow="Just In"
            title="New Arrivals"
            subtitle="The latest additions to the collection."
          />
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase text-[--color-ink] hover:text-[--color-bronze-700] border-b border-[--color-ink] pb-0.5"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* PROMO STRIP */}
      <section className="container-luxe py-12">
        <div className="grid md:grid-cols-2 gap-5">
          <PromoCard
            kicker="Mercantix Atelier"
            title="Tailored in Italy"
            subtitle="Heritage craftsmanship — five generations of cut & cloth."
            cta="Shop Atelier"
            href="/products?cat=men&sub=suits"
            image="https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=1200&q=80&auto=format"
            tone="dark"
          />
          <PromoCard
            kicker="Members"
            title="Inner Circle"
            subtitle="Early access to drops, private fittings, complimentary alterations."
            cta="Join Free"
            href="/register"
            image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&auto=format"
            tone="light"
          />
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-luxe py-12">
        <SectionHeading
          eyebrow="Loved by Many"
          title="Best Sellers"
          subtitle="Pieces our community returns to, season after season."
        />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-[--color-cream] mt-12">
        <div className="container-luxe py-20 grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <figure key={i} className="flex flex-col gap-4">
              <div className="flex gap-0.5 text-[--color-warning]">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={14} className="fill-current" />
                ))}
              </div>
              <blockquote className="font-display text-xl leading-snug text-[--color-ink]">
                “{t.quote}”
              </blockquote>
              <figcaption className="text-xs tracking-[0.16em] uppercase text-[--color-mist]">
                — {t.name}, {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-t border-[--color-sand]/70">
        <div className="container-luxe py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-[--color-ink]">
          <TrustItem icon={<Truck size={20} />} title="Complimentary Shipping" sub="On orders over $200" />
          <TrustItem icon={<RotateCcw size={20} />} title="Easy Returns" sub="30-day window, no questions" />
          <TrustItem icon={<ShieldCheck size={20} />} title="Secure Checkout" sub="256-bit SSL encryption" />
          <TrustItem icon={<Sparkles size={20} />} title="Artisan Made" sub="Italy · Portugal · Japan" />
        </div>
      </section>
    </div>
  );
}

function PromoCard({ kicker, title, subtitle, cta, href, image, tone = "dark" }) {
  return (
    <Link
      to={href}
      className="group relative block aspect-[16/9] md:aspect-[5/4] overflow-hidden rounded-sm bg-[--color-cream]"
    >
      <ImageWithFallback
        src={image}
        alt={title}
        wrapperClassName="absolute inset-0"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(min-width: 768px) 50vw, 100vw"
      />
      <div
        className={`absolute inset-0 ${tone === "dark"
          ? "bg-gradient-to-r from-black/65 via-black/30 to-transparent"
          : "bg-gradient-to-r from-[--color-ivory]/85 via-[--color-ivory]/35 to-transparent"
          }`}
      />
      <div
        className={`absolute inset-y-0 left-0 flex flex-col justify-center p-8 md:p-10 max-w-sm ${tone === "dark" ? "text-[--color-ivory]" : "text-[--color-ink]"
          }`}
      >
        <span className="text-[11px] tracking-[0.22em] uppercase opacity-80">{kicker}</span>
        <h3 className="font-display text-3xl md:text-4xl mt-1.5">{title}</h3>
        <p className="text-sm opacity-80 mt-3">{subtitle}</p>
        <span className="inline-flex items-center gap-1.5 mt-5 text-xs tracking-[0.16em] uppercase border-b border-current pb-0.5 w-fit">
          {cta} <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

function TrustItem({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[--color-bronze-700]">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-[--color-mist]">{sub}</p>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote: "Mercantix has become my entire wardrobe. The fabrics are sublime, the cuts impeccable.",
    name: "Eleanor V.",
    role: "Editor, Vogue Italia",
  },
  {
    quote: "I've never bought clothes that fit this well. It's like having a personal tailor on call.",
    name: "Marcus T.",
    role: "Creative Director",
  },
  {
    quote: "Quietly luxurious. Considered. The kind of clothes that just get better with time.",
    name: "Priya R.",
    role: "Architect",
  },
];
