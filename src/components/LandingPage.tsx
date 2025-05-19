import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  MoveRight, 
  ArrowRight, 
  Lightbulb,
  GitBranch,
  Network,
  MousePointer,
  ArrowDown
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatingElement = ({ children, delay = 0, y = 20, duration = 0.8 }) => (
  <motion.div
    initial={{ y, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration,
      delay,
      type: "spring",
      stiffness: 100
    }}
  >
    {children}
  </motion.div>
);

const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full filter blur-[100px] animate-float top-0 -left-20"></div>
    <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full filter blur-[100px] animate-float-delayed bottom-20 -right-20"></div>
    <div className="absolute w-[300px] h-[300px] bg-pink-500/20 rounded-full filter blur-[100px] animate-float-reverse top-1/2 left-1/2"></div>
  </div>
);

// AnimatedBlob component with proper TypeScript types
const AnimatedBlob = ({ 
  color, 
  size = 300, 
  top, 
  left, 
  right, 
  bottom, 
  delay = 0 
}: { 
  color: string; 
  size?: number; 
  top?: string; 
  left?: string; 
  right?: string; 
  bottom?: string; 
  delay?: number; 
}) => (
  <motion.div
    className={`absolute rounded-full filter blur-[70px] opacity-30 pointer-events-none z-0`}
    style={{ 
      background: color,
      width: size, 
      height: size,
      top, left, right, bottom
    }}
    animate={{
      scale: [1, 1.2, 1.1, 1.3, 1],
      x: [0, 15, -15, -20, 0],
      y: [0, -15, 15, -10, 0],
      rotate: [0, 10, -10, 15, 0],
    }}
    transition={{
      duration: 15,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1],
      repeat: Infinity,
      delay
    }}
  />
);

// Particle effect component for enhanced visual appeal
const ParticleEffect = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: 0.5
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
            y: [`${particle.y}%`, `${particle.y - 10}%`]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Define Feature interface
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

// Enhanced interactive floating cards with perspective tilt with TypeScript typing
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const maxTilt = 10; // Maximum tilt angle in degrees
    const tiltFactorX = maxTilt / (rect.width / 2);
    const tiltFactorY = maxTilt / (rect.height / 2);
    
    setTiltX(-mouseY * tiltFactorY);
    setTiltY(mouseX * tiltFactorX);
  };

  const resetTilt = () => {
    setTiltX(0);
    setTiltY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 group cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetTilt}
      style={{
        perspective: '1000px',
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`absolute -inset-px bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      {/* Glow effect that moves with hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 z-0 opacity-30 rounded-xl overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${50 + tiltY/2}% ${50 - tiltX/2}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 75%)`,
          }}
        />
      )}
      
      <div className="relative z-10">
        <div 
          className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} w-fit mb-4 transform transition-transform duration-300`}
          style={{
            transform: isHovered ? `translateZ(20px)` : 'none',
          }}
        >
          {feature.icon}
        </div>
        <h3 
          className="text-xl font-semibold mb-3 text-white transform transition-transform duration-300"
          style={{
            transform: isHovered ? `translateZ(15px)` : 'none',
          }}
        >
          {feature.title}
        </h3>
        <p 
          className="text-white/70 transform transition-transform duration-300"
          style={{
            transform: isHovered ? `translateZ(10px)` : 'none',
          }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      title: "Interactive Mind Mapping",
      description: "Create stunning visual maps with our intuitive drag-and-drop interface.",
      icon: <Brain className="w-8 h-8" />,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Smart Connections",
      description: "Connect ideas seamlessly with automatic node expansion and organization.",
      icon: <Network className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Dynamic Layouts",
      description: "Watch your ideas reorganize beautifully with smart layout algorithms.",
      icon: <GitBranch className="w-8 h-8" />,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Visual Thinking",
      description: "Transform complex thoughts into clear, organized visual concepts.",
      icon: <Lightbulb className="w-8 h-8" />,
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  // Scroll indicator animation - simplified to avoid type issues
  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1,
      y: 0
    }
  };

  // Create a pulse effect using CSS animation instead
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(true);

  useEffect(() => {
    // Show scroll indicator on load
    setIsScrollIndicatorVisible(true);
    
    // Hide scroll indicator when user scrolls down
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrollIndicatorVisible(false);
      } else {
        setIsScrollIndicatorVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      {/* Dynamic gradient blobs */}
      <AnimatedBlob color="linear-gradient(135deg, #7f41ff 0%, #6366f1 100%)" size={600} top="5%" left="-15%" delay={0} />
      <AnimatedBlob color="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" size={500} bottom="10%" right="-10%" delay={3} />
      <AnimatedBlob color="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)" size={400} top="40%" right="60%" delay={1.5} />
      
      <GlowingBackground />
      <ParticleEffect />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div 
          className="absolute w-full h-full"
          style={{ y: parallaxY, opacity: parallaxOpacity }}
        >
          <div className="grid-animation opacity-10"></div>
        </motion.div>

        <motion.div
          style={{ scale: headerScale }}
          className="z-10"
        >
          <FloatingElement>
            <div className="relative mb-6">
              <motion.img 
                src="/mindflow-logo.svg" 
                alt="MindFlow Logo" 
                className="w-64 md:w-72 mx-auto mb-6 filter drop-shadow-lg" 
                animate={{
                  rotateZ: [0, 2, 0, -2, 0],
                  scale: [1, 1.05, 1, 1.05, 1]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-75 blur"
                animate={{
                  background: [
                    'linear-gradient(to right, #7c3aed, #db2777, #3b82f6)',
                    'linear-gradient(to right, #3b82f6, #7c3aed, #db2777)',
                    'linear-gradient(to right, #db2777, #3b82f6, #7c3aed)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <h1 className="relative text-5xl sm:text-6xl md:text-7xl font-bold text-white text-center">
                Mind Spark Flow
                <Sparkles className="absolute -top-8 -right-8 w-12 h-12 text-yellow-300 animate-pulse-slow" />
              </h1>
            </div>
          </FloatingElement>

          <FloatingElement delay={0.2}>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl text-center mb-8 md:mb-12 leading-relaxed">
              Transform your thoughts into stunning visual maps with our next-generation mind mapping tool.
              <span className="block mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">
                Create. Connect. Innovate.
              </span>
            </p>
          </FloatingElement>

          <FloatingElement delay={0.4}>
            <motion.button
              onClick={() => navigate('/mindmap')}
              className="group relative px-8 py-4 text-xl font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/20 to-purple-600/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>
          </FloatingElement>
        </motion.div>

        {/* Scroll indicator */}
        {isScrollIndicatorVisible && (
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial="hidden"
            animate="visible"
            variants={scrollIndicatorVariants}
          >
            <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 text-white/60 animate-pulse-slow" />
          </motion.div>
        )}
      </header>

      {/* Features Section with enhanced interaction */}
      <section className="relative py-20 md:py-32">
        <motion.div 
          className="max-w-7xl mx-auto px-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              className="text-lg text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Everything you need to organize your thoughts and bring your ideas to life.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Interactive Demo Preview Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              See It In Action
            </motion.h2>
            <motion.p 
              className="text-lg text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Experience how Mind Spark Flow can transform your idea organization process.
            </motion.p>
          </div>
          
          <motion.div 
            className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-neon-lg"
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <MousePointer className="w-12 h-12 text-white/50 mx-auto mb-6 animate-pulse" />
                <motion.button
                  onClick={() => navigate('/mindmap')}
                  className="px-6 py-3 text-lg font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-neon transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    Try Demo Now
                    <Zap className="w-5 h-5" />
                  </span>
                </motion.button>
                <p className="mt-4 text-white/60 text-sm">No sign-up required.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Footer with Newsletter Signup */}
      <footer className="relative py-16 md:py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Mind Spark Flow</h3>
              <p className="text-white/60 mb-6 max-w-sm">Empowering your creative thinking with visual mind mapping tools designed for the modern thinker.</p>
              <div className="flex space-x-4">
                <a href="https://x.com/kd_master99" className="text-white/70 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://github.com/Kunal-Darekar" className="text-white/70 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
            >
              <h4 className="text-white font-medium mb-3">Stay Updated</h4>
              <p className="text-white/60 text-sm mb-4">Get notified about new features and updates.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-medium hover:shadow-neon transition-all duration-300">
                  Subscribe
                </button>
              </div>
              <p className="text-white/40 text-xs mt-3">We respect your privacy. Unsubscribe anytime.</p>
            </motion.div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">© 2025 Mind Spark Flow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
