import { Camera } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    alt: 'Feira de artesanato local',
    className: 'col-span-1 md:col-span-2 row-span-2'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
    alt: 'Artesão trabalhando com argila',
    className: 'col-span-1 row-span-1'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1605372488880-9289bc9c7e2b?auto=format&fit=crop&q=80&w=800',
    alt: 'Trabalhos manuais e costura',
    className: 'col-span-1 row-span-1'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800',
    alt: 'Comunidade reunida',
    className: 'col-span-1 md:col-span-2 row-span-1'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1520005703714-d83515439265?auto=format&fit=crop&q=80&w=800',
    alt: 'Produtos em exposição',
    className: 'col-span-1 row-span-2'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800',
    alt: 'Oficina de artes',
    className: 'col-span-1 md:col-span-2 row-span-1'
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export function CommunityGallery() {
  return (
    <section
      id="galeria" className="py-24 md:py-32 bg-stone-100 dark:bg-stone-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-stone-200 dark:bg-stone-900 rounded-2xl mb-6">
            <Camera className="w-8 h-8 text-stone-700 dark:text-stone-300" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-6">
            Galeria da Comunidade
          </h2>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Registros dos nossos encontros, oficinas e da beleza do trabalho manual sendo feito em conjunto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {galleryImages.map((image) => (
            <div
              key={image.id} className={`relative rounded-2xl overflow-hidden group shadow-lg ${image.className}`}
            >
              <img
                src={image.url}
                alt={image.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
