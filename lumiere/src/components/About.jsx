import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion'
import { u, rv } from '../assets/data'

function Counter({ to, suffix = '' }) {
  const ref = useRef(), inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => { if (inView) { const c = animate(0, to, { duration: 2, onUpdate: v => setN(Math.round(v)) }); return () => c.stop() } }, [inView, to])
  return <span ref={ref}>{n}{suffix}</span>
}

export default function About() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  return (
    <section id="about" className="section" ref={ref}>
      <div className="container about-grid">
        <motion.div className="about-img" {...rv}>
          <motion.img style={{ y }} src={u('1500648767791-00dcc994a43e', 1000)} alt="Portrait of photographer Melvin" loading="lazy" />
          <div className="frame" />
        </motion.div>
        <motion.div {...rv}>
          <p className="eyebrow">About the photographer</p>
          <h2 className="title">Light, patience and a little bit of magic.</h2>
          <p>I picked up my first film camera at fifteen and never put it down. Over a career spanning weddings, fashion editorials and remote travel assignments, I have learned that the best photographs come when people forget I am there.</p>
          <p>My vision is simple: honest emotion, beautifully lit. I blend documentary instinct with a cinematic eye, so every gallery feels like a story you can step back into years later.</p>
          <div className="stats">
            <div><b><Counter to={15} suffix="+" /></b><span>Years of experience</span></div>
            <div><b><Counter to={850} suffix="+" /></b><span>Projects completed</span></div>
            <div><b><Counter to={600} suffix="+" /></b><span>Happy clients</span></div>
          </div>
          <a href="#contact" className="btn btn-gold">Work with me</a>
        </motion.div>
      </div>
    </section>
  )
}
