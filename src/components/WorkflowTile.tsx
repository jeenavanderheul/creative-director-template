import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export interface Workflow {
  id: string;
  label: string;
  title: string;
  description: string;
  seed: string;
}

interface WorkflowTileProps {
  workflow: Workflow;
  offsetDirection: 1 | -1;
}

export function WorkflowTile({ workflow, offsetDirection }: WorkflowTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = 60 * offsetDirection;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.4]);

  const imgSrc = `/placeholders/image.svg`;

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="flex flex-col gap-4"
    >
      <div className="group relative aspect-video overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
        <img
          src={imgSrc}
          alt={workflow.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-active:scale-105 group-active:grayscale-0"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-nano font-mono uppercase tracking-wider opacity-50 text-black dark:text-white">
          {workflow.label}
        </span>
        <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-black dark:text-white">
          {workflow.title}
        </h3>
        <p className="text-xs sm:text-sm font-normal text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {workflow.description}
        </p>
      </div>
    </motion.div>
  );
}
