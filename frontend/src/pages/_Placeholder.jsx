/**
 * Temporary placeholder used while pages are scaffolded out across turns.
 * Each page below will be replaced with a full implementation.
 */
export default function Placeholder({ title, kicker = "Coming next" }) {
  return (
    <section className="container-luxe py-32 flex flex-col items-center text-center gap-3">
      <span className="eyebrow">{kicker}</span>
      <h1 className="font-display text-4xl md:text-5xl text-[--color-ink]">{title}</h1>
      <p className="text-[--color-mist] max-w-md text-sm">
        This page is scaffolded and will be implemented in the next iteration.
        Routing, layout, and theme are in place.
      </p>
    </section>
  );
}
