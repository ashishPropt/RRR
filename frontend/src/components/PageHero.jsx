export default function PageHero({ title, subtitle, bg = 'bg-primary' }) {
  return (
    <div className={`${bg} pt-32 pb-16 text-center relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #4ab5c4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4ab5c4 0%, transparent 40%)' }} />
      <div className="relative max-w-4xl mx-auto px-4">
        {subtitle && <p className="section-subtitle text-accent mb-2">{subtitle}</p>}
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">{title}</h1>
        <div className="w-16 h-1 bg-accent mx-auto mt-6" />
      </div>
    </div>
  );
}
