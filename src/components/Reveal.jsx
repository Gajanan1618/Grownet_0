import { useReveal } from '../hooks/useReveal.js'

/**
 * Scroll-triggered entrance wrapper — fade+slide-up by default, or
 * fade+scale with `scale`. `delay` (ms) lets a grid of cards stagger in
 * one after another instead of all popping in at once.
 */
export default function Reveal({ children, delay = 0, scale = false, className = '', as: Tag = 'div' }) {
  const [ref, visible] = useReveal()

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={
        'transition-all duration-700 ease-out motion-reduce:transition-none ' +
        (visible
          ? 'opacity-100 translate-y-0 scale-100'
          : scale
          ? 'opacity-0 scale-95'
          : 'opacity-0 translate-y-7') +
        ' ' +
        className
      }
    >
      {children}
    </Tag>
  )
}
