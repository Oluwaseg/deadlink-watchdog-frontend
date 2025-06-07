'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthState } from '@/features/auth/hooks/useAuth';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  Code,
  Database,
  Globe,
  Mail,
  Play,
  Search,
  Server,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export default function LandingPage() {
  const router = useRouter();
  const authState = useAuthState();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const techStackRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (authState.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authState.isAuthenticated, router]);

  useEffect(() => {
    // GSAP Timeline for hero section
    const tl = gsap.timeline();

    tl.from('.hero-badge', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
    })
      .from(
        '.hero-title',
        {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .from(
        '.hero-description',
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6'
      )
      .from(
        '.hero-buttons',
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      );

    // Floating animation for hero stats
    gsap.to('.floating-stat', {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.2,
    });

    // Scroll-triggered animations
    ScrollTrigger.batch('.feature-card', {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
        });
      },
      start: 'top 80%',
    });

    ScrollTrigger.batch('.tech-item', {
      onEnter: (elements) => {
        gsap.from(elements, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        });
      },
      start: 'top 80%',
    });

    // Counter animation for stats
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.stat-number', {
          textContent: 0,
          duration: 2,
          ease: 'power1.out',
          snap: { textContent: 1 },
          stagger: 0.2,
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className='min-h-screen bg-background overflow-x-hidden'>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <motion.div
              className='flex items-center space-x-2'
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className='flex items-center space-x-2'>
                <motion.div
                  className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Search className='h-5 w-5 text-primary-foreground' />
                </motion.div>
                <span className='text-xl font-bold text-foreground'>
                  DeadLink Watchdog
                </span>
              </div>
            </motion.div>
            <nav className='hidden md:flex items-center space-x-8'>
              {['Features', 'Demo', 'Tech Stack', 'Contact', 'Pricing'].map(
                (item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Link
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {item}
                    </Link>
                  </motion.div>
                )
              )}
            </nav>
            <motion.div
              className='flex items-center space-x-4'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant='ghost' size='sm'>
                Sign In
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='sm'>Get Started</Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section ref={heroRef} className='py-20 lg:py-32'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-4xl mx-auto'>
            <div className='flex items-center justify-center mb-6'>
              <div className='hero-badge'>
                <Badge variant='secondary' className='px-4 py-2 text-sm'>
                  🇳🇬 Optimized for Nigerian Websites
                </Badge>
              </div>
            </div>
            <h1 className='hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight'>
              Monitor Broken Links
              <span className='block text-primary'>
                Across Nigeria&apos;s Web
              </span>
            </h1>
            <p className='hero-description text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed'>
              A powerful API service that automatically monitors Nigerian
              websites for broken links, ensuring optimal web health across
              Nigeria&apos;s digital landscape.
            </p>
            <div className='hero-buttons flex flex-col sm:flex-row gap-4 justify-center'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='lg' className='px-8 py-3'>
                  Start Monitoring
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant='outline' size='lg' className='px-8 py-3'>
                  <Link href='#demo' className='flex items-center'>
                    Watch Demo
                    <Play className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <div className='mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto'>
              {[
                { value: '95%', label: 'Average Health Score' },
                { value: '100+', label: 'Links Checked Per Site' },
                { value: '24/7', label: 'Continuous Monitoring' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className='floating-stat text-center'
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.2 }}
                >
                  <div className='text-3xl font-bold text-primary'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section id='demo' className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
              See DeadLink Watchdog in Action
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Watch how our powerful monitoring system keeps Nigerian websites
              healthy and performing at their best
            </p>
          </motion.div>

          <motion.div
            className='max-w-4xl mx-auto'
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className='relative rounded-xl overflow-hidden shadow-2xl bg-card border border-border'>
              {/* Video Container */}
              <div className='relative aspect-video bg-muted/50'>
                {!isVideoPlaying ? (
                  // Video Thumbnail/Placeholder
                  <motion.div
                    className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 cursor-pointer group'
                    onClick={() => setIsVideoPlaying(true)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className='text-center'>
                      <motion.div
                        className='mx-auto mb-4 h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors'
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Play className='h-8 w-8 text-primary-foreground ml-1' />
                      </motion.div>
                      <h3 className='text-xl font-semibold text-foreground mb-2'>
                        Watch Product Demo
                      </h3>
                      <p className='text-muted-foreground'>
                        See how DeadLink Watchdog monitors and protects Nigerian
                        websites
                      </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className='absolute top-4 left-4 flex items-center space-x-2'>
                      <div className='h-3 w-3 rounded-full bg-destructive'></div>
                      <div className='h-3 w-3 rounded-full bg-secondary'></div>
                      <div className='h-3 w-3 rounded-full bg-primary'></div>
                    </div>

                    <div className='absolute bottom-4 right-4'>
                      <Badge
                        variant='secondary'
                        className='bg-background/80 text-foreground'
                      >
                        🇳🇬 Nigerian Focused
                      </Badge>
                    </div>
                  </motion.div>
                ) : (
                  // Actual Video (replace with your video URL)
                  <video
                    className='w-full h-full object-cover'
                    controls
                    autoPlay
                    poster='/placeholder.svg?height=600&width=800'
                  >
                    <source src='your-video-url.mp4' type='video/mp4' />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Video Info */}
              <div className='p-6 bg-card'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-semibold text-foreground mb-1'>
                      DeadLink Watchdog - Complete Overview
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Learn how to monitor, analyze, and maintain website health
                      across Nigeria
                    </p>
                  </div>
                  <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                    <span className='flex items-center'>
                      <Clock className='h-4 w-4 mr-1' />
                      3:45
                    </span>
                    <span className='flex items-center'>
                      <Users className='h-4 w-4 mr-1' />
                      1.2K views
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Features */}
            <motion.div
              className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'
              variants={staggerContainer}
              initial='initial'
              whileInView='animate'
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Search,
                  title: 'Live Crawling Demo',
                  description: 'Watch real-time website crawling in action',
                },
                {
                  icon: BarChart3,
                  title: 'Health Analytics',
                  description: 'See detailed health scores and insights',
                },
                {
                  icon: Bell,
                  title: 'Alert System',
                  description: 'Experience instant notifications for issues',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className='text-center p-4'
                >
                  <motion.div
                    className='mx-auto mb-3 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center'
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <feature.icon className='h-6 w-6 text-primary' />
                  </motion.div>
                  <h5 className='font-semibold text-foreground mb-1'>
                    {feature.title}
                  </h5>
                  <p className='text-sm text-muted-foreground'>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 bg-muted/50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
              How DeadLink Watchdog Works
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Simple, automated monitoring that keeps your websites healthy
            </p>
          </motion.div>
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
          >
            {[
              {
                step: '1',
                title: 'Add Websites',
                description:
                  'Users add websites they want to monitor (news, government, business sites)',
                icon: Globe,
              },
              {
                step: '2',
                title: 'Auto Crawling',
                description:
                  'System crawls websites automatically (daily/weekly/monthly)',
                icon: Search,
              },
              {
                step: '3',
                title: 'Link Testing',
                description:
                  'Tests each link for broken status (404, timeout, server errors)',
                icon: CheckCircle,
              },
              {
                step: '4',
                title: 'Health Reports',
                description: 'Provides analytics, alerts, and trends over time',
                icon: BarChart3,
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className='relative group hover:shadow-lg transition-all duration-300'>
                  <CardHeader className='text-center'>
                    <motion.div
                      className='mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <item.icon className='h-6 w-6 text-primary' />
                    </motion.div>
                    <motion.div
                      className='absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold'
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {item.step}
                    </motion.div>
                    <CardTitle className='text-lg'>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-center'>
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' ref={featuresRef} className='py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
              Powerful Features
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Everything you need to keep your websites healthy and performing
            </p>
          </motion.div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                title: 'Smart Web Crawling',
                description:
                  'Puppeteer-powered link extraction and validation with intelligent crawling algorithms',
                icon: Search,
                color: 'text-chart-1',
              },
              {
                title: 'Health Scoring',
                description:
                  'Real-time website health metrics (0-100%) with detailed breakdowns',
                icon: BarChart3,
                color: 'text-chart-2',
              },
              {
                title: 'Instant Alerts',
                description:
                  'Email and webhook notifications for broken links and health issues',
                icon: Bell,
                color: 'text-chart-3',
              },
              {
                title: 'Auto Scheduling',
                description:
                  'Daily, weekly, or monthly crawls with customizable scheduling options',
                icon: Clock,
                color: 'text-chart-4',
              },
              {
                title: 'Analytics Dashboard',
                description:
                  'Comprehensive statistics, trends, and insights over time',
                icon: TrendingUp,
                color: 'text-chart-5',
              },
              {
                title: 'Nigerian Focus',
                description:
                  'Optimized for local websites and infrastructure with regional insights',
                icon: Shield,
                color: 'text-chart-1',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className='feature-card'
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Card className='group hover:shadow-lg transition-all duration-300 h-full'>
                  <CardHeader>
                    <motion.div
                      className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </motion.div>
                    <CardTitle className='text-xl'>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-base'>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id='tech-stack' ref={techStackRef} className='py-20 bg-muted/50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
              Built with Modern Technology
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Production-ready architecture designed for scale and reliability
            </p>
          </motion.div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            <motion.div
              variants={fadeInLeft}
              initial='initial'
              whileInView='animate'
              viewport={{ once: true }}
            >
              <h3 className='text-2xl font-bold text-foreground mb-6'>
                Backend & Infrastructure
              </h3>
              <div className='space-y-4'>
                {[
                  {
                    name: 'Node.js & Express.js',
                    description: 'High-performance server runtime',
                    icon: Server,
                  },
                  {
                    name: 'PostgreSQL & Sequelize',
                    description: 'Robust database with ORM',
                    icon: Database,
                  },
                  {
                    name: 'Redis & Bull Queue',
                    description: 'Background job processing',
                    icon: Zap,
                  },
                  {
                    name: 'Puppeteer',
                    description: 'Browser automation for crawling',
                    icon: Code,
                  },
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    className='tech-item flex items-start space-x-4 p-4 rounded-lg bg-background border border-border'
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <tech.icon className='h-5 w-5 text-primary' />
                    </motion.div>
                    <div>
                      <h4 className='font-semibold text-foreground'>
                        {tech.name}
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {tech.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              variants={fadeInRight}
              initial='initial'
              whileInView='animate'
              viewport={{ once: true }}
            >
              <h3 className='text-2xl font-bold text-foreground mb-6'>
                Features & Security
              </h3>
              <div className='space-y-4'>
                {[
                  {
                    name: 'JWT Authentication',
                    description: 'Secure token-based auth',
                    icon: Shield,
                  },
                  {
                    name: 'Email Notifications',
                    description: 'Nodemailer integration',
                    icon: Mail,
                  },
                  {
                    name: 'Queue Management',
                    description: 'Concurrent job processing',
                    icon: Activity,
                  },
                  {
                    name: 'RESTful API',
                    description: 'Clean, documented endpoints',
                    icon: Code,
                  },
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    className='tech-item flex items-start space-x-4 p-4 rounded-lg bg-background border border-border'
                    whileHover={{ scale: 1.02, x: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'
                      whileHover={{ rotate: -360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <tech.icon className='h-5 w-5 text-primary' />
                    </motion.div>
                    <div>
                      <h4 className='font-semibold text-foreground'>
                        {tech.name}
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {tech.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className='py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
              Trusted by Nigerian Businesses
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Join the growing community of websites maintaining optimal health
            </p>
          </motion.div>
          <motion.div
            className='grid grid-cols-1 md:grid-cols-4 gap-8'
            variants={staggerContainer}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
          >
            {[
              { number: '500+', label: 'Websites Monitored', icon: Globe },
              { number: '50K+', label: 'Links Checked Daily', icon: Search },
              { number: '99.9%', label: 'Uptime Guarantee', icon: CheckCircle },
              { number: '24/7', label: 'Support Available', icon: Users },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className='text-center'
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className='mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center'
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <stat.icon className='h-8 w-8 text-primary' />
                </motion.div>
                <div className='stat-number text-4xl font-bold text-foreground mb-2'>
                  {stat.number}
                </div>
                <div className='text-muted-foreground'>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-20 bg-muted/50'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-4'>
              Get in Touch
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Ready to start monitoring your website? Have questions? We&apos;d
              love to hear from you.
            </p>
          </motion.div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto'>
            {/* Contact Info */}
            <motion.div
              variants={fadeInLeft}
              initial='initial'
              whileInView='animate'
              viewport={{ once: true }}
              className='space-y-8'
            >
              <div>
                <h3 className='text-2xl font-bold text-foreground mb-6'>
                  Let&apos;s Start a Conversation
                </h3>
                <p className='text-muted-foreground mb-8'>
                  Whether you&apos;re a small business or a large enterprise,
                  we&apos;re here to help you maintain optimal website health
                  across Nigeria&apos;s digital landscape.
                </p>
              </div>

              <div className='space-y-6'>
                {[
                  {
                    icon: Mail,
                    title: 'Email Us',
                    description: 'support@deadlinkwatchdog.com',
                    color: 'text-primary',
                  },
                  {
                    icon: Users,
                    title: 'Sales Team',
                    description: 'sales@deadlinkwatchdog.com',
                    color: 'text-secondary',
                  },
                  {
                    icon: Globe,
                    title: 'Nigerian Support',
                    description: 'Local support for Nigerian businesses',
                    color: 'text-primary',
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className='flex items-start space-x-4'
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <motion.div
                      className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0`}
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <contact.icon className={`h-6 w-6 ${contact.color}`} />
                    </motion.div>
                    <div>
                      <h4 className='font-semibold text-foreground mb-1'>
                        {contact.title}
                      </h4>
                      <p className='text-muted-foreground'>
                        {contact.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className='p-6 rounded-lg bg-secondary/10 border border-secondary/20'
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className='flex items-center space-x-3 mb-3'>
                  <span className='text-2xl'>🇳🇬</span>
                  <h4 className='font-semibold text-foreground'>
                    Made for Nigeria
                  </h4>
                </div>
                <p className='text-sm text-muted-foreground'>
                  We understand the unique challenges of Nigerian websites and
                  provide localized support and optimization.
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={fadeInRight}
              initial='initial'
              whileInView='animate'
              viewport={{ once: true }}
            >
              <Card className='p-8'>
                <CardHeader className='px-0 pt-0'>
                  <CardTitle className='text-2xl'>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you
                    within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className='px-0 pb-0'>
                  <form className='space-y-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <label className='text-sm font-medium text-foreground mb-2 block'>
                          First Name
                        </label>
                        <Input placeholder='John' className='w-full' />
                      </motion.div>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <label className='text-sm font-medium text-foreground mb-2 block'>
                          Last Name
                        </label>
                        <Input placeholder='Doe' className='w-full' />
                      </motion.div>
                    </div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <label className='text-sm font-medium text-foreground mb-2 block'>
                        Email Address
                      </label>
                      <Input
                        type='email'
                        placeholder='john@example.com'
                        className='w-full'
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <label className='text-sm font-medium text-foreground mb-2 block'>
                        Website URL (Optional)
                      </label>
                      <Input
                        placeholder='https://yourwebsite.com'
                        className='w-full'
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <label className='text-sm font-medium text-foreground mb-2 block'>
                        Message
                      </label>
                      <Textarea
                        placeholder='Tell us about your website monitoring needs...'
                        className='w-full min-h-[120px]'
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        size='lg'
                        className='w-full bg-primary hover:bg-primary/90'
                      >
                        Send Message
                        <ArrowRight className='ml-2 h-5 w-5' />
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className='py-20 bg-primary text-primary-foreground'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            className='text-center max-w-3xl mx-auto'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl lg:text-4xl font-bold mb-6'>
              Ready to Monitor Your Website Health?
            </h2>
            <p className='text-xl mb-8 opacity-90'>
              Start monitoring your Nigerian website for broken links today. Get
              instant alerts, detailed analytics, and ensure optimal web health.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size='lg'
                  className='px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90'
                >
                  Start Free Trial
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size='lg'
                  variant='outline'
                  className='px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary'
                >
                  Contact Sales
                </Button>
              </motion.div>
            </div>
            <motion.p
              className='text-sm mt-6 opacity-75'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className='py-12 border-t border-border'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <motion.div
              className='col-span-1 md:col-span-2'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                className='flex items-center space-x-2 mb-4'
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Search className='h-5 w-5 text-primary-foreground' />
                </motion.div>
                <span className='text-xl font-bold text-foreground'>
                  DeadLink Watchdog
                </span>
              </motion.div>
              <p className='text-muted-foreground mb-4 max-w-md'>
                Keeping Nigerian websites healthy, one link at a time. Monitor,
                analyze, and maintain optimal web health across Nigeria&apos;s
                digital landscape.
              </p>
              <motion.div
                className='flex items-center space-x-2'
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <span className='text-2xl'>🇳🇬</span>
                <span className='text-sm text-muted-foreground'>
                  Made for Nigeria
                </span>
              </motion.div>
            </motion.div>
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'API Docs', 'Status'],
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact', 'Privacy', 'Terms'],
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className='font-semibold text-foreground mb-4'>
                  {section.title}
                </h3>
                <ul className='space-y-2 text-sm text-muted-foreground'>
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Link
                          href='#'
                          className='hover:text-foreground transition-colors'
                        >
                          {link}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            className='border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2024 DeadLink Watchdog. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
