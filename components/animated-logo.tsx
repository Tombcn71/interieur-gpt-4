"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 40;
    canvas.height = 40;

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 40, 40);
      gradient.addColorStop(0, "#3b82f6"); // blue-500
      gradient.addColorStop(1, "#1d4ed8"); // blue-700
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(0, 0, 40, 40, 10);
      ctx.fill();

      // Draw decorative elements
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.arc(35, 5, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.arc(5, 35, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw house
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Roof
      ctx.moveTo(8, 15);
      ctx.lineTo(20, 5);
      ctx.lineTo(32, 15);

      // House body
      ctx.lineTo(32, 32);
      ctx.lineTo(8, 32);
      ctx.closePath();
      ctx.stroke();

      // Door
      ctx.beginPath();
      ctx.moveTo(16, 32);
      ctx.lineTo(16, 24);
      ctx.lineTo(24, 24);
      ctx.lineTo(24, 32);
      ctx.stroke();

      // Window
      ctx.fillStyle = "white";
      ctx.fillRect(26, 18, 3, 3);

      // Furniture element (small line)
      ctx.beginPath();
      ctx.moveTo(12, 20);
      ctx.lineTo(20, 20);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // Initial draw
    draw();

    // Optional: Add subtle animation
    let animationFrame: number;
    const animate = () => {
      // You could add subtle animations here
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="relative w-10 h-10 rounded-xl shadow-md overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
        interieurGPT
      </span>
    </Link>
  );
}
