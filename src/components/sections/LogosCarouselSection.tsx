
import React, { useRef, useEffect } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface BrandLogo {
  name: string;
  logo: string;
  description: string;
}

interface LogosCarouselSectionProps {
  brandLogos: BrandLogo[];
}

const LogosCarouselSection = ({ brandLogos }: LogosCarouselSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5;

    const step = () => {
      if (!container) return;
      scrollAmount += scrollSpeed;
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
      }
      container.scrollTo({ left: scrollAmount });
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom text-center">
        <ScrollReveal>
          <h3 className="text-base text-gray-700 font-semibold uppercase mb-8 tracking-wide">
            The Most Powerful Tools for Your Business
          </h3>
        </ScrollReveal>

        <div ref={scrollRef} className="overflow-hidden">
          <div className="flex gap-12 md:gap-16 w-max">
            {duplicatedLogos.map((brand, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center min-w-[100px]"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-10 transition-opacity duration-300"
                />
                <div className="absolute top-full mt-3 w-56 bg-white text-sm text-gray-700 shadow-lg rounded-lg px-4 py-3
                  transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300 ease-out z-10 pointer-events-none text-left">
                  {brand.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogosCarouselSection;
