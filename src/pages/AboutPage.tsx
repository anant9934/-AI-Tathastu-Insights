import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ShieldCheck, 
  Layers, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Award, 
  Eye, 
  Compass, 
  Code2, 
  Cpu, 
  FileText 
} from 'lucide-react';
import { mockAuthors } from '../lib/mockData';
import { Reveal } from '../components/motion/Reveal';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { EDITORIAL_EASE } from '../lib/motion';

export const AboutPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const authorsList = Object.values(mockAuthors);

  return (
    <div className="min-h-screen py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header Banner */}
      <Reveal>
        <div className="border-b border-brand-stone-dark/80 dark:border-dark-border pb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-blue font-semibold">
              Company Mission &amp; Purpose
            </span>
            <span className="text-brand-muted dark:text-dark-muted">•</span>
            <span className="text-xs font-mono text-brand-muted dark:text-dark-muted">
              Founded 2025
            </span>
          </div>
          <h1 className="type-hero text-brand-charcoal dark:text-dark-text tracking-tight font-semibold">
            Why we founded AI Tathastu.
          </h1>
          <p className="mt-4 text-base sm:text-xl text-brand-muted dark:text-dark-muted max-w-3xl leading-relaxed">
            We started AI Tathastu with a clear conviction: the future of artificial intelligence cannot be governed by corporate secrecy, blackbox APIs, or speculative marketing claims. We build technology around real problems and document every system with total transparency.
          </p>
        </div>
      </Reveal>

      {/* The 4 Founding Principles */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-muted font-semibold block mb-1">
            Core Convictions
          </span>
          <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
            The principles that guide our work.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-softblue text-accent-blue dark:bg-accent-blue/20 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-brand-charcoal dark:text-dark-text">
              1. Engineering Before Rhetoric
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
              We judge technology by what it actually executes in production, not by corporate benchmark cherry-picking. If a system fails on latency, state drift, or out-of-distribution reasoning, we publish the failure alongside the code.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-softmint text-accent-sage dark:bg-accent-sage/20 flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-brand-charcoal dark:text-dark-text">
              2. Open Knowledge Distribution
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
              Breakthroughs in mechanistic interpretability, multi-agent consensus, and spatial vision should not remain locked inside private foundation labs. Our research, adapters, and tools are openly documented for the global community.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-peach text-accent-terracotta dark:bg-accent-terracotta/20 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-brand-charcoal dark:text-dark-text">
              3. Practical Problem-Solving
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
              We do not build technology for the sake of novelty. Each of our products—MentorMaze, Collaborate, Avsar, Iris—was conceived to eliminate a concrete bottleneck experienced by real builders and students.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-butter text-accent-amber dark:bg-accent-amber/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-brand-charcoal dark:text-dark-text">
              4. Complete Intellectual Independence
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
              We operate without advertising, paid advertorials, or proprietary vendor subsidies. Our technical evaluations remain completely decoupled from commercial conflicts of interest.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 Products in Summary */}
      <section className="p-8 sm:p-14 rounded-3xl bg-brand-stone dark:bg-dark-elevated border border-brand-stone-dark/80 dark:border-dark-border space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-muted dark:text-dark-muted font-semibold block mb-1">
            What We Build
          </span>
          <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
            Four systems addressing fundamental bottlenecks.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border">
            <GraduationCap className="w-6 h-6 text-accent-blue mb-3" />
            <h3 className="font-semibold text-base text-brand-charcoal dark:text-dark-text">MentorMaze</h3>
            <p className="text-xs text-brand-muted dark:text-dark-muted mt-2 leading-relaxed">
              AI Socratic mentorship diagnosing prerequisite knowledge gaps for aspiring researchers.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border">
            <Users className="w-6 h-6 text-accent-blue mb-3" />
            <h3 className="font-semibold text-base text-brand-charcoal dark:text-dark-text">Collaborate</h3>
            <p className="text-xs text-brand-muted dark:text-dark-muted mt-2 leading-relaxed">
              Byzantine multi-agent lab environment bounding swarm turn latency to under 200ms.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border">
            <Award className="w-6 h-6 text-accent-terracotta mb-3" />
            <h3 className="font-semibold text-base text-brand-charcoal dark:text-dark-text">Avsar</h3>
            <p className="text-xs text-brand-muted dark:text-dark-muted mt-2 leading-relaxed">
              Peer opportunity network disbursing non-dilutive micro-grants within 72 hours.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border">
            <Eye className="w-6 h-6 text-accent-sage mb-3" />
            <h3 className="font-semibold text-base text-brand-charcoal dark:text-dark-text">Iris</h3>
            <p className="text-xs text-brand-muted dark:text-dark-muted mt-2 leading-relaxed">
              Continuous 3D voxel perceptual memory providing real-time object permanence for robotics.
            </p>
          </div>
        </div>
      </section>

      {/* The Resident Team */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-muted font-semibold block mb-1">
            People Behind The Systems
          </span>
          <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
            Our engineering &amp; research team.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {authorsList.map((author) => (
            <div
              key={author.id}
              className="p-6 rounded-2xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial flex flex-col justify-between"
            >
              <div>
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-16 h-16 rounded-2xl object-cover mb-4 border border-brand-stone-dark/80"
                />
                <h3 className="text-base font-semibold text-brand-charcoal dark:text-dark-text">
                  {author.name}
                </h3>
                <p className="text-xs font-mono text-accent-blue mt-0.5">
                  {author.role.replace('(Demonstration Persona)', '').trim()}
                </p>
                <p className="text-xs text-brand-muted dark:text-dark-muted mt-3 leading-relaxed">
                  {author.bio.replace(/\[.*?\]/g, '').trim()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
