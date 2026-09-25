"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type ProjectsSwiperProps = {
  projects: Project[];
};

export function ProjectsSwiper({ projects }: ProjectsSwiperProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="projects-swiper-wrapper">
      {/* Interactive Controls Bar */}
      <div className="projects-swiper-controls-bar">
        <div className="projects-swiper-drag-hint" aria-hidden="true">
          <MoveHorizontal size={15} />
          <span>Arraste para explorar</span>
        </div>

        <div className="projects-swiper-navigation-group">
          <button
            ref={prevRef}
            type="button"
            className="projects-nav-btn projects-nav-prev"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Projetos anteriores"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            ref={nextRef}
            type="button"
            className="projects-nav-btn projects-nav-next"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Próximos projetos"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
        }}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={16}
        speed={600}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        grabCursor
        keyboard={{ enabled: true }}
        watchSlidesProgress
        pagination={{
          clickable: true,
          el: ".projects-custom-pagination",
          bulletClass: "projects-pagination-bullet",
          bulletActiveClass: "projects-pagination-bullet-active",
        }}
        breakpoints={{
          768: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 24,
          },
        }}
        className="projects-swiper-container"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id} className="projects-swiper-slide">
            <ProjectCard project={project} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Indicator */}
      <div className="projects-custom-pagination" />
    </div>
  );
}
