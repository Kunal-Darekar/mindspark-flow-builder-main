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
  ArrowDown,
  Rocket,
  PanelLeft,
  Code,
  Stars,
  Wand2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Enhanced floating element with more animation options
const FloatingElement = ({ 
  children, 
  delay = 0, 
  y = 20, 
  x = 0,
  duration = 0.8, 
  type = "spring",
  stiffness = 100
}) => (
  <motion.div
    initial={{ y, x, opacity: 0 }}
    animate={{ y: 0, x: 0, opacity: 1 }}
    transition={{
      duration,
      delay,
      type,
      stiffness
    }}
  >
    {children}
  </motion.div>
);

// Enhanced glowing background with more dynamic elements
const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full filter blur-[100px] animate-float top-0 -left-20"></div>
    <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full filter blur-[100px] animate-float-delayed bottom-20 -right-20"></div>
    <div className="absolute w-[300px] h-[300px] bg-pink-500/20 rounded-full filter blur-[100px] animate-float-reverse top-1/2 left-1/2"></div>
    <div className="absolute w-[350px] h-[350px] bg-indigo-500/20 rounded-full filter blur-[120px] animate-float top-3/4 -left-10 animation-delay-2000"></div>
    <div className="absolute w-[250px] h-[250px] bg-cyan-500/20 rounded-full filter blur-[90px] animate-float-reverse top-1/4 right-1/4 animation-delay-1000"></div>
  </div>
);

// Improved animated blob with more dynamic morphing
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
      borderRadius: ['50%', '40% 60% 70% 30%', '30% 70% 70% 30%', '50% 50% 40% 60%', '50%'],
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

// Enhanced particle effect with more variety and movement
const ParticleEffect = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.3,
      color: index % 5 === 0 ? 'rgba(155, 135, 245, 0.7)' : 
             index % 4 === 0 ? 'rgba(59, 130, 246, 0.7)' :
             index % 3 === 0 ? 'rgba(236, 72, 153, 0.7)' : 'rgba(255, 255, 255, 0.7)'
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            backgroundColor: particle.color
          }}
          animate={{
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0],
            y: [`${particle.y}%`, `${particle.y - 15}%`],
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`]
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

// Animated shooting stars background element
const ShootingStars = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => ({
      id: index,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 10,
      size: Math.random() * 100 + 50
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size
          }}
          animate={{
            left: [`${star.left}%`, `-${star.size}px`],
            top: [`${star.top}%`, `${star.top + 10}%`],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// 3D Floating cube component for visual interest
const FloatingCube = ({ size = 80, delay = 0, position }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        ...position,
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        rotateZ: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay
      }}
    >
      <div className="relative" style={{ width: size, height: size, transformStyle: 'preserve-3d' }}>
        {/* Front */}
        <div className="absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-sm rounded-md" 
          style={{ transform: `translateZ(${size/2}px)` }} />
        {/* Back */}
        <div className="absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-sm rounded-md" 
          style={{ transform: `translateZ(-${size/2}px) rotateY(180deg)` }} />
        {/* Right */}
        <div className="absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-sm rounded-md" 
          style={{ transform: `translateX(${size/2}px) rotateY(90deg)` }} />
        {/* Left */}
        <div className="absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-sm rounded-md" 
          style={{ transform: `translateX(-${size/2}px) rotateY(-90deg)` }} />
        {/* Top */}
        <div className="absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-sm rounded-md" 
          style={{ transform: `translateY(-${size/2}px) rotateX(90deg)` }} />
        {/* Bottom */}
        <div className="absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-sm rounded-md" 
          style={{ transform: `translateY(${size/2}px) rotateX(-90deg)` }} />
      </div>
    </motion.div>
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
    const maxTilt = 15; // Increased maximum tilt angle for more dramatic effect
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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.7, type: "spring" }}
      whileHover={{ scale: 1.03 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetTilt}
      style={{
        perspective: '1500px',
        transform: `perspective(1500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.05s ease',
      }}
    >
      <div className={`absolute -inset-px bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />
      
      {/* Enhanced particle background effect when hovered */}
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full bg-white`}
              initial={{ 
                width: 2 + Math.random() * 3, 
                height: 2 + Math.random() * 3,
                opacity: 0.2 + Math.random() * 0.4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                scale: 0
              }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 0.7, 0],
                y: [-10, -30]
              }}
              transition={{
                duration: 1 + Math.random() * 1,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Glow effect that moves with hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 z-0 opacity-40 rounded-xl overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${50 + tiltY/2}% ${50 - tiltX/2}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 75%)`,
          }}
        />
      )}
      
      <div className="relative z-10">
        <div 
          className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} w-fit mb-4 transform transition-transform duration-300 shadow-lg`}
          style={{
            transform: isHovered ? `translateZ(40px)` : 'none',
            boxShadow: isHovered ? '0 0 15px rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {feature.icon}
        </div>
        <h3 
          className="text-xl font-semibold mb-3 text-white transform transition-transform duration-300"
          style={{
            transform: isHovered ? `translateZ(30px)` : 'none',
            textShadow: isHovered ? '0 5px 10px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          {feature.title}
        </h3>
        <p 
          className="text-white/70 transform transition-transform duration-300"
          style={{
            transform: isHovered ? `translateZ(20px)` : 'none',
          }}
        >
          {feature.description}
        </p>
        
        {/* Animated arrow button that appears on hover */}
        <motion.div
          className="mt-5 overflow-hidden h-0 group-hover:h-8 transition-all duration-300"
          style={{
            transform: isHovered ? `translateZ(25px)` : 'none',
          }}
        >
          <span className="inline-flex items-center gap-1 text-sm font-medium bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            Learn more <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// New component: Magnetic Button with motion tracking
const MagneticButton = ({ children, className = "", onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current || !isHovered) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const moveX = (e.clientX - centerX) * 0.3;
    const moveY = (e.clientY - centerY) * 0.3;
    
    setPosition({ x: moveX, y: moveY });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetPosition}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// New component: Animated text reveal for headings
const AnimatedTextReveal = ({ text, className = "", delay = 0, once = true }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once }}
        transition={{ 
          delay, 
          duration: 0.5,
          ease: [0.33, 1, 0.68, 1]  // cubic-bezier
        }}
      >
        {text}
      </motion.div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [cursorVariant, setCursorVariant] = useState("default");
  
  // Enhanced parallax effects
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const headerRotate = useTransform(scrollYProgress, [0, 0.2], [0, -2]);
  
  // Background star field parallax
  const starFieldY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  
  // Text animation timing
  const titleAnimation = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  
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

  // Enhanced features list with more options
  const features = [
    {
      title: "Interactive Mind Mapping",
      description: "Create stunning visual maps with our intuitive drag-and-drop interface and dynamic node connections.",
      icon: <Brain className="w-8 h-8" />,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Smart Connections",
      description: "Connect ideas seamlessly with automatic node expansion and intelligent relationship visualization.",
      icon: <Network className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Dynamic Layouts",
      description: "Watch your ideas reorganize beautifully with smart layout algorithms and smooth animations.",
      icon: <GitBranch className="w-8 h-8" />,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Visual Thinking",
      description: "Transform complex thoughts into clear, organized visual concepts with customizable styling options.",
      icon: <Lightbulb className="w-8 h-8" />,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Enterprise Templates",
      description: "Jump-start your process with our professionally designed strategic planning templates.",
      icon: <PanelLeft className="w-8 h-8" />,
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      title: "AI-Powered Suggestions",
      description: "Get intelligent recommendations for organizing your thoughts and improving your mind maps.",
      icon: <Wand2 className="w-8 h-8" />,
      gradient: "from-fuchsia-500 to-purple-500"
    }
  ];

  // Advanced features for enterprise section
  const advancedFeatures = [
    {
      title: "Collaborative Real-time Editing",
      description: "Work together with your team in real-time with collaborative editing and commenting.",
      icon: <Rocket className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Data Integration",
      description: "Connect your mind maps to external data sources and APIs for dynamic content.",
      icon: <Code className="w-6 h-6 text-white" />,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Advanced Analytics",
      description: "Gain insights from your mind maps with powerful analytics and visualization tools.",
      icon: <Stars className="w-6 h-6 text-white" />,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  // Scroll indicator animation
  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(true);

  useEffect(() => {
    setIsScrollIndicatorVisible(true);
    
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
      {/* Enhanced dynamic gradient blobs */}
      <AnimatedBlob color="linear-gradient(135deg, #7f41ff 0%, #6366f1 100%)" size={600} top="5%" left="-15%" delay={0} />
      <AnimatedBlob color="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" size={500} bottom="10%" right="-10%" delay={3} />
      <AnimatedBlob color="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)" size={400} top="40%" right="60%" delay={1.5} />
      <AnimatedBlob color="linear-gradient(135deg, #14b8a6 0%, #10b981 100%)" size={450} bottom="30%" left="5%" delay={2} />
      
      <GlowingBackground />
      <ParticleEffect />
      <ShootingStars />
      
      {/* 3D Floating Elements */}
      <FloatingCube size={60} delay={1} position={{ top: '15%', right: '15%' }} />
      <FloatingCube size={40} delay={2} position={{ bottom: '20%', left: '10%' }} />
      <FloatingCube size={80} delay={3} position={{ top: '60%', right: '5%' }} />
      
      {/* Enhanced grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <motion.div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"
        style={{ y: starFieldY }}
      ></motion.div>

      {/* Hero Section with enhanced animations */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <motion.div 
          className="absolute w-full h-full"
          style={{ y: parallaxY, opacity: parallaxOpacity }}
        >
          <div className="grid-animation opacity-10"></div>
        </motion.div>

        <motion.div
          style={{ 
            scale: headerScale,
            rotateZ: headerRotate
          }}
          className="z-10 relative"
        >
          <FloatingElement>
            <div className="relative mb-6 group">
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-75 blur-xl group-hover:opacity-100 transition duration-1000"
                animate={{
                  background: [
                    'linear-gradient(to right, #7c3aed, #db2777, #3b82f6)',
                    'linear-gradient(to right, #3b82f6, #7c3aed, #db2777)',
                    'linear-gradient(to right, #db2777, #3b82f6, #7c3aed)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              
              <motion.img 
                src="/mindflow-logo.svg" 
                alt="MindFlow Logo" 
                className="relative w-64 md:w-72 mx-auto mb-6 filter drop-shadow-lg" 
                animate={{
                  rotateZ: [0, 2, 0, -2, 0],
                  scale: [1, 1.05, 1, 1.05, 1],
                  filter: [
                    'drop-shadow(0px 0px 10px rgba(155, 135, 245, 0.5))',
                    'drop-shadow(0px 0px 15px rgba(155, 135, 245, 0.8))',
                    'drop-shadow(0px 0px 10px rgba(155, 135, 245, 0.5))'
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <h1 className="relative text-5xl sm:text-6xl md:text-7xl font-bold text-center">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Mind Spark Flow
                </span>
                <motion.div
                  className="absolute -top-8 -right-8 z-10"
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-12 h-12 text-yellow-300 filter drop-shadow-lg" />
                </motion.div>
              </h1>
            </div>
          </FloatingElement>

          <FloatingElement delay={0.2} type="tween">
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl text-center mb-8 md:mb-12 leading-relaxed">
              Transform your thoughts into stunning visual maps with our next-generation mind mapping tool.
              <motion.span 
                className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-medium"
                animate={{
                  backgroundPosition: ["0% center", "100% center"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% auto"
                }}
              >
                Create. Connect. Innovate.
              </motion.span>
            </p>
          </FloatingElement>

          <FloatingElement delay={0.4}>
            <MagneticButton 
              onClick={() => navigate('/mindmap')}
              className="group relative px-8 py-4 text-xl font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white overflow-hidden shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow duration-500"
            >
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 z-0"
                animate={{
                  background: [
                    'linear-gradient(to right, #7c3aed, #3b82f6)',
                    'linear-gradient(to right, #8b5cf6, #4f46e5)',
                    'linear-gradient(to right, #7c3aed, #3b82f6)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <motion.div
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    repeatDelay: 1
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/20 to-purple-600/0"
                initial={{ x: '-100%' }}
                animate={isScrollIndicatorVisible ? { x: ['100%', '-100%'] } : { x: '-100%' }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            </MagneticButton>
          </FloatingElement>
        </motion.div>

        {/* Enhanced scroll indicator */}
        {isScrollIndicatorVisible && (
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial="hidden"
            animate="visible"
            variants={scrollIndicatorVariants}
          >
            <motion.span 
              className="text-white/60 text-sm mb-2"
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Scroll to explore
            </motion.span>
            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ArrowDown className="w-5 h-5 text-white/60" />
            </motion.div>
          </motion.div>
        )}
      </header>

      {/* Features Section with enhanced interaction */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background particle trail effect */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(1px)"
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <div className="inline-block">
              <motion.div 
                className="relative mb-2"
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full top-0 left-1/2 transform -translate-x-1/2"></div>
              </motion.div>
              <AnimatedTextReveal
                text={<h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Powerful Features</h2>}
                className="overflow-hidden"
                once={true}
              />
            </div>
            
            <motion.p 
              className="text-lg text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Everything you need to organize your thoughts and bring your ideas to life.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
          
          {/* Call to action button */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <MagneticButton
              onClick={() => navigate('/mindmap')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors shadow-xl"
            >
              <span>Experience all features</span>
              <motion.div
                animate={{
                  x: [0, 5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop" as const,
                  repeatDelay: 1
                }}
              >
                <MoveRight className="w-5 h-5" />
              </motion.div>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Demo Preview Section with enhanced visuals */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-purple-900/30 to-gray-900/0"></div>
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-16">
            <div className="inline-block">
              <motion.div 
                className="relative mb-2"
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full top-0 left-1/2 transform -translate-x-1/2"></div>
              </motion.div>
              <AnimatedTextReveal
                text={<h2 className="text-3xl md:text-5xl font-bold text-white mb-6">See It In Action</h2>}
                className="overflow-hidden"
                once={true}
              />
            </div>
            
            <motion.p 
              className="text-lg text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
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
            {/* Background grid animation */}
            <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md">
              <div className="absolute inset-0 grid-animation opacity-20"></div>
            </div>
            
            {/* Floating UI elements for visual interest */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-48 h-48 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full filter blur-xl"
                animate={{
                  x: [50, 150, 50],
                  y: [50, 100, 50],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ left: '10%', top: '20%' }}
              />
              <motion.div
                className="absolute w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full filter blur-xl"
                animate={{
                  x: [0, -50, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ right: '15%', bottom: '25%' }}
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center max-w-lg mx-auto px-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <MousePointer className="w-12 h-12 text-white/50 mx-auto mb-6" />
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <MagneticButton
                    onClick={() => navigate('/mindmap')}
                    className="px-8 py-4 text-lg font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      Try Demo Now
                      <motion.div
                        animate={{
                          rotate: [0, 20, 0, -20, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </MagneticButton>
                  <p className="mt-4 text-white/60 text-sm">No sign-up required.</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Footer with Newsletter Signup and 3D elements */}
      <footer className="relative py-16 md:py-20 border-t border-white/10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-full bg-grid-pattern opacity-10"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500/10"
              style={{
                width: 100 + Math.random() * 200,
                height: 100 + Math.random() * 200,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: "blur(50px)"
              }}
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-5">
                <img src="/mindflow-logo.svg" alt="Logo" className="h-8 w-auto" />
                <h3 className="text-xl font-bold text-white">Mind Spark Flow</h3>
              </div>
              <p className="text-white/60 mb-6 max-w-sm">Empowering your creative thinking with visual mind mapping tools designed for the modern thinker and enterprise teams.</p>
              
              <div className="flex space-x-4 mb-8">
                <a 
                  href="https://x.com/kd_master99" 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="https://github.com/Kunal-Darekar" 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              
              <div className="flex flex-col gap-2">
                <h4 className="text-white font-medium">Product</h4>
                <div className="flex flex-col gap-2 text-white/60">
                  <a href="#" className="hover:text-white transition-colors">Features</a>
                  <a href="#" className="hover:text-white transition-colors">Pricing</a>
                  <a href="#" className="hover:text-white transition-colors">Enterprise</a>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="lg:col-span-1"
            >
              <div className="p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl h-full">
                <h4 className="text-xl text-white font-semibold mb-4">Advanced Features</h4>
                <ul className="space-y-4 mb-6">
                  {advancedFeatures.map((feature, i) => (
                    <motion.li 
                      key={feature.title}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.gradient} flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className="text-white font-medium">{feature.title}</h5>
                        <p className="text-white/60 text-sm">{feature.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-white/10">
                  <MagneticButton
                    onClick={() => navigate('/mindmap')}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-medium text-center group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Try Enterprise Features
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/20 to-purple-600/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="lg:col-span-1"
            >
              <div className="p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl h-full">
                <div className="flex flex-col h-full">
                  <h4 className="text-white font-semibold mb-3">Join Our Newsletter</h4>
                  <p className="text-white/60 text-sm mb-6">Get notified about new features, updates, and enterprise offerings.</p>
                  
                  <form className="flex flex-col gap-4 mt-auto">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-lg opacity-0 hover:opacity-20 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0"></div>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="Your email"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-lg opacity-0 hover:opacity-20 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0"></div>
                    </div>
                    
                    <button 
                      type="button"
                      className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Subscribe</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/20 to-purple-600/0"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.8 }}
                      />
                    </button>
                  </form>
                  
                  <p className="text-white/40 text-xs mt-4">We respect your privacy. Unsubscribe anytime.</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-12 pt-6 border-t border-white/10 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-white/60 text-sm">
              © 2025 Mind Spark Flow. All rights reserved.
              <motion.span
                className="inline-block ml-2"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 10
                }}
              >
                ❤️
              </motion.span>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
