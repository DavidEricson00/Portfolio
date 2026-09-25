"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import pixelDavid from "./assets/images/pixel-david.png";
import pixelDavidHover from "./assets/images/pixel-david-hover.png";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { EducationSection } from "@/components/education/EducationSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { SectionProgress } from "@/components/navigation/SectionProgress";

export default function Home() {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;

    if (!image || !canvas) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) return;

    const checkPixel = (event: MouseEvent) => {
      const rect = image.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        setIsHoveringImage(false);
        return;
      }

      const naturalWidth = image.naturalWidth;
      const naturalHeight = image.naturalHeight;

      canvas.width = naturalWidth;
      canvas.height = naturalHeight;

      context.clearRect(0, 0, naturalWidth, naturalHeight);
      context.drawImage(image, 0, 0, naturalWidth, naturalHeight);

      const pixelX = Math.floor((x / rect.width) * naturalWidth);
      const pixelY = Math.floor((y / rect.height) * naturalHeight);

      const pixel = context.getImageData(pixelX, pixelY, 1, 1).data;

      setIsHoveringImage(pixel[3] > 0);
    };

    const stopHover = () => {
      setIsHoveringImage(false);
    };

    image.addEventListener("mousemove", checkPixel);
    image.addEventListener("mouseleave", stopHover);

    return () => {
      image.removeEventListener("mousemove", checkPixel);
      image.removeEventListener("mouseleave", stopHover);
    };
  }, []);

  return (
    <main>
      <SectionProgress />

      <section id="inicio" className="hero">
        <div className="hero-background" aria-hidden="true">
          <div className="hero-glow hero-glow-blue" />
          <div className="hero-glow hero-glow-purple" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">FULLSTACK DEVELOPER</p>

            <h1>
              David
              <br />
              <span>Ericson.</span>
            </h1>

            <p className="hero-description">
              Desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs e
              arquitetura de sistemas. Gosto de transformar problemas reais em
              aplicações bem estruturadas.
            </p>

            <div className="hero-stack">
              <span>Node.js</span>
              <span>TypeScript</span>
              <span>React</span>
              <span>PostgreSQL</span>
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href="#projetos">
                Ver projetos
                <span>↗</span>
              </a>

              <a className="button button-secondary" href="#contato">
                Entre em contato
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-halo" />
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />

            <div className="hero-image-wrapper">
              <Image
                ref={imageRef}
                src={isHoveringImage ? pixelDavidHover : pixelDavid}
                alt="Pixel art de David Ericson com os braços cruzados"
                width={1024}
                height={1024}
                priority
                unoptimized
                className="hero-image"
              />
            </div>

            <canvas ref={canvasRef} hidden />
          </div>
        </div>
      </section>

      <ExperienceSection />

      <ProjectsSection />


      <SkillsSection />

      <EducationSection />

      <ContactSection />
    </main>
  );
}