import React, { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  isHero?: boolean;
  delay?: number;
  id?: string;
}

/**
 * AnimatedSection: Wrapper reutilizável com acessibilidade (WCAG) para animações suaves via framer-motion.
 * - Respeita rigorosamente a preferência do sistema operacional (prefers-reduced-motion).
 * - Deslocamento vertical mínimo de 12px (evita vertigem para público sênior).
 * - Duração curta de 0.28s (<= 0.3s) com easeOut suave.
 * - Hero anima imediatamente no carregamento; demais seções usam whileInView com amount: 'some'
 *   para garantir exibição confiável mesmo em seções altas em telas menores.
 */
export function AnimatedSection({
  children,
  className = '',
  isHero = false,
  delay = 0,
  id,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const initialY = shouldReduceMotion ? 0 : 12;
  const clampedDelay = shouldReduceMotion ? 0 : Math.min(Math.max(delay, 0), 0.15);
  const transition = {
    duration: shouldReduceMotion ? 0.01 : 0.28,
    delay: clampedDelay,
    ease: 'easeOut' as const,
  };

  if (isHero) {
    return (
      <motion.div
        id={id}
        className={className}
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: initialY }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
