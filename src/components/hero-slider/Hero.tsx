import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Importa los estilos necesarios
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Importa las imágenes
import slide01 from "../../assets/slide-01.jpg";
import slide02 from "../../assets/slide-02.jpg";
import slide03 from "../../assets/slide-03.jpg";

// Estilos para las animaciones y la apariencia del slider
const sliderStyles = `
  /* Oculta las flechas de navegación por defecto */
  .swiper-button-next,
  .swiper-button-prev {
    opacity: 0;
    transition: opacity 0.3s ease;
    color: #f59e0b !important; /* Color ámbar */
  }
  /* Muestra las flechas cuando el cursor está sobre el slider */
  .hero-section:hover .swiper-button-next,
  .hero-section:hover .swiper-button-prev {
    opacity: 1;
  }
  .swiper-pagination-bullet-active {
    background: #f59e0b !important; /* Color ámbar */
  }
  /* Animación para el texto */
  .swiper-slide-active .slide-content {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.4s;
  }
  .slide-content {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
  }
`;

interface SlideData {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

const slideImages: SlideData[] = [
  {
    src: slide01.src,
    alt: "Interior de un auto moderno en carretera",
    title: "E-GoCars: Tu Próximo Nivel",
    subtitle: "Descubre una selección exclusiva de vehículos que definen el mañana.",
    buttonText: "Explorar Catálogo",
    buttonUrl: "/catalogo",
  },
  {
    src: slide02.src,
    alt: "Persona revisando un auto en un concesionario",
    title: "Vende con Inteligencia",
    subtitle: "Valoramos tu auto para ofrecerte la mejor oferta del mercado.",
    buttonText: "Vender mi Auto",
    buttonUrl: "/contacto",
  },
  {
    src: slide03.src,
    alt: "Mecánico trabajando en un auto de alta gama",
    title: "Asesoría de Élite",
    subtitle: "Nuestro equipo experto te acompaña en cada decisión importante.",
    buttonText: "Contactar Asesor",
    buttonUrl: "/contacto",
  },
];

const HeroSlider: React.FC = () => {
  return (
    <>
      <style>{sliderStyles}</style>
      <section className="hero-section relative h-screen -mt-20">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={1200} // Transición más suave
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          className="w-full h-full"
        >
          {slideImages.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="slide-content text-center text-white max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 font-light text-gray-200">
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.buttonUrl}
                      className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 transform hover:scale-105"
                    >
                      {slide.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default HeroSlider;