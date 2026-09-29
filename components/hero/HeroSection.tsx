"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import pixelDavid from "@/app/assets/images/pixel-david.png";
import pixelDavidHover from "@/app/assets/images/pixel-david-hover.png";
import "./hero.css";

const HERO_STACK = ["Node.js", "TypeScript", "React", "PostgreSQL"];

export function HeroSection() {
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

      if (naturalWidth === 0 || naturalHeight === 0) return;

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
    <section id="inicio" className="hero" aria-label="Apresentação">
      <div className="hero-background" aria-hidden="true">
        <div className="hero-glow hero-glow-blue" />
        <div className="hero-glow hero-glow-purple" />
        <div className="hero-grid" />
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-eyebrow">FULLSTACK DEVELOPER</p>

          <h1>
            David <span className="hero-title-last">Ericson.</span>
          </h1>

          <p className="hero-description">
            Desenvolvedor Fullstack com foco em Node.js, TypeScript, APIs e
            arquitetura de sistemas. Gosto de transformar problemas reais em
            aplicações bem estruturadas.
          </p>

          <div className="hero-stack" aria-label="Principais tecnologias">
            <span className="sr-only">Principais tecnologias:</span>
            {HERO_STACK.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
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
          <div className="hero-image-halo" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

          <div className="hero-image-wrapper">
            <Image
              ref={imageRef}
              src={isHoveringImage ? pixelDavidHover : pixelDavid}
              alt="Pixel art de David Ericson com os braços cruzados"
              width={768}
              height={768}
              priority
              sizes="(max-width: 640px) 290px, (max-width: 1024px) 480px, 768px"
              className="hero-image"
            />
          </div>

          <canvas ref={canvasRef} hidden aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
