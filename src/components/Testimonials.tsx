import React, { useState, useEffect, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "A Associação Julieta Barros mudou a forma como eu vejo meu próprio trabalho. Antes eu produzia sozinha em casa, hoje faço parte de uma família que se apoia e cresce junto.",
    author: "Dona Lúcia",
    role: "Artesã de Crochê",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 2,
    content: "Ter um espaço para expor minhas cerâmicas me deu segurança para viver da minha arte. A troca de conhecimentos nas oficinas é impagável.",
    author: "Seu Raimundo",
    role: "Ceramista",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 3,
    content: "As feiras nos fins de semana trouxeram vida nova para a Zona Norte. É lindo ver a comunidade abraçando o que a gente produz com tanto carinho.",
    author: "Amanda Costa",
    role: "Costureira Criativa",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1bfdd8?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 4,
    content: "Encontrei na nossa associação não apenas parceiros para divulgar no departamento Rosa Mística, mas amigos para a vida toda. O apoio mútuo faz toda a diferença.",
    author: "José Silva",
    role: "Marceneiro",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [paginate]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      id="depoimentos" className="py-24 md:py-32 bg-green-50 dark:bg-green-950/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-6">
            Vozes da Comunidade
          </h2>
          <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            O que diz a nossa gente que faz a Associação Julieta Barros acontecer todos os dias.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto h-[400px] md:h-[350px]">
            <div
              key={currentIndex}
              className="absolute inset-0 bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2rem] shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800 flex flex-col justify-center"
            >
              <Quote className="w-12 h-12 text-green-200 dark:text-green-900/50 absolute top-8 right-8" />
              <p className="text-xl md:text-2xl text-stone-700 dark:text-stone-300 italic mb-8 relative z-10 leading-relaxed font-medium">
                "{currentTestimonial.content}"
              </p>
              <div className="flex items-center gap-5 mt-auto">
                <img 
                  src={currentTestimonial.avatar} 
                  alt={currentTestimonial.author} className="w-16 h-16 rounded-full object-cover border-4 border-green-100 dark:border-green-900/50"
                  draggable={false}
                />
                <div>
                  <h4 className="font-extrabold text-lg text-stone-900 dark:text-white">
                    {currentTestimonial.author}
                  </h4>
                  <span className="text-base text-green-700 dark:text-green-500 font-bold">
                    {currentTestimonial.role}
                  </span>
                </div>
              </div>
            </div>
          

          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-20 z-10">
            <button 
              onClick={() => paginate(-1)} className="p-3 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-green-700 dark:hover:text-green-400 rounded-full shadow-lg border border-stone-200 dark:border-stone-700 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500/20"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-20 z-10">
            <button 
              onClick={() => paginate(1)} className="p-3 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-green-700 dark:hover:text-green-400 rounded-full shadow-lg border border-stone-200 dark:border-stone-700 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500/20"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index} onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }} className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-600 dark:bg-green-500 w-8' 
                  : 'bg-stone-300 dark:bg-stone-700 hover:bg-stone-400 dark:hover:bg-stone-600'
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
