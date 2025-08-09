// src/components/ui/Vortex.tsx
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  rangeHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

export const Vortex: React.FC<VortexProps> = ({
  children,
  className,
  containerClassName,
  particleCount = 700,
  rangeY = 800,
  baseHue = 220,
  rangeHue = 100,
  baseSpeed = 0.1,
  rangeSpeed = 1,
  baseRadius = 1,
  rangeRadius = 2,
  backgroundColor = "transparent",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      x: number;
      y: number;
      speed: number;
      radius: number;
      hue: number;
      opacity: number;
      fadeDirection: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * rangeY;
        this.speed = baseSpeed + Math.random() * rangeSpeed;
        this.radius = baseRadius + Math.random() * rangeRadius;
        this.hue = baseHue + Math.random() * rangeHue;
        this.opacity = Math.random();
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.y += this.speed;
        this.opacity += this.fadeDirection * 0.01;

        if (this.opacity <= 0 || this.opacity >= 1) {
          this.fadeDirection *= -1;
        }

        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        if (!ctx) return;

        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.8)`;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [
    particleCount,
    rangeY,
    baseHue,
    rangeHue,
    baseSpeed,
    rangeSpeed,
    baseRadius,
    rangeRadius,
    backgroundColor,
  ]);

  return (
    <div className={cn("relative h-screen w-full", containerClassName)}>
      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0 z-0", className)}
        style={{
          background:
            "radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
