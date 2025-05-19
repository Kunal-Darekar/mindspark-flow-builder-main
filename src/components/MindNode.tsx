import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronRight, Plus, Settings, Link, Paperclip, Image, FileText, AlertTriangle, CheckCircle2, CircleDot, Tag } from 'lucide-react';
import useMindMapStore from '../store/mindMapStore';
import { useMediaQuery } from '../hooks/use-mobile';

interface MindNodeProps {
  id: string;
  data: {
    label: string;
    expanded: boolean;
    color?: string;
    animation?: string;
    attachment?: {
      type: 'image' | 'link' | 'file';
      url: string;
      title?: string;
    };
    notes?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
  };
  isConnectable: boolean;
}

// Add priority indicator component
const PriorityIndicator = ({ priority, isDarkMode }: { priority?: 'low' | 'medium' | 'high', isDarkMode: boolean }) => {
  if (!priority) return null;
  
  const getProps = () => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          className: isDarkMode ? 'bg-red-500/40 text-white' : 'bg-red-100 text-red-700'
        };
      case 'medium':
        return {
          icon: <CircleDot className="w-3 h-3" />,
          className: isDarkMode ? 'bg-blue-500/40 text-white' : 'bg-blue-100 text-blue-700'
        };
      case 'low':
        return {
          icon: <CheckCircle2 className="w-3 h-3" />,
          className: isDarkMode ? 'bg-green-500/40 text-white' : 'bg-green-100 text-green-700'
        };
      default:
        return null;
    }
  };
  
  const props = getProps();
  if (!props) return null;
  
  return (
    <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center ${props.className}`}>
      {props.icon}
    </div>
  );
};

const MindNode = memo(({ id, data, isConnectable }: MindNodeProps) => {
  const { toggleNodeExpanded, selectNode, selectedNodeId, addNode } = useMindMapStore();
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const isSelected = id === selectedNodeId;
  const isRoot = id === 'root';
  const nodeColor = data.color || '#9b87f5';
  const animation = data.animation || 'pulse';
  
  // Track mouse position for dynamic lighting effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track dark mode changes
  useEffect(() => {
    // Set dark mode as default on initial load
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    }
    
    setIsDarkMode(true);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isHovered || isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered, isMobile]);
  
  const handleExpand = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleNodeExpanded(id);
  };
  
  const handleAddMiddleNode = (event: React.MouseEvent) => {
    event.stopPropagation();
    addNode(id, undefined, 'middle');
  };
  
  // Dynamic gradient variables based on mouse position
  const gradientDegree = (mousePosition.x * 180) + (mousePosition.y * 45);
  const gradientLight = Math.min(mousePosition.x * 15, 15);
  
  // Animation classes
  const animationClass = isSelected 
    ? 'animate-pulse-glow'
    : animation !== 'none' 
      ? `animate-${animation}` 
      : '';

  // Determine text color based on light/dark mode and node color
  const getTextColor = () => {
    if (isDarkMode) return '#fff';
    
    // For light mode, calculate if we need dark or light text based on node color
    const hex = nodeColor.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Calculate luminance - if dark color, use white text, otherwise dark
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1e293b' : '#fff';
  };
  
  const textColor = getTextColor();

  // Enterprise-level visualization enhancements
  const getAnimationStyles = () => {
    if (animation === 'none' || isSelected) return {};
    
    switch(animation) {
      case 'shimmer':
        return {
          background: `linear-gradient(90deg, ${adjustColor(nodeColor, -15)} 0%, ${nodeColor} 25%, ${adjustColor(nodeColor, 15)} 50%, ${nodeColor} 75%, ${adjustColor(nodeColor, -15)} 100%)`,
          backgroundSize: '200% 100%'
        } as React.CSSProperties;
      case 'ripple':
        return {
          position: 'relative' as const,
          overflow: 'hidden' as const
        };
      default:
        return {};
    }
  };
  
  return (
    <div 
      ref={nodeRef}
      className={`px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 min-w-[140px] max-w-[220px] group relative
        ${isSelected ? 'scale-[1.05] z-50' : 'hover:scale-[1.025]'}
        ${animationClass}`}
      style={{ 
        background: isHovered
          ? `linear-gradient(${gradientDegree}deg, ${adjustColor(nodeColor, -15)} 0%, ${nodeColor} 50%, ${adjustColor(nodeColor, 15)} 100%)`
          : `linear-gradient(135deg, ${adjustColor(nodeColor, -10)} 0%, ${nodeColor} 50%, ${adjustColor(nodeColor, 10)} 100%)`,
        color: textColor,
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        boxShadow: isSelected 
          ? `0 0 20px ${adjustColor(nodeColor, -20)}90, 0 0 35px ${adjustColor(nodeColor, -20)}40` 
          : isHovered
            ? `0 0 15px ${adjustColor(nodeColor, -20)}60, 0 0 25px ${adjustColor(nodeColor, -20)}30`
            : `0 0 8px ${adjustColor(nodeColor, -20)}40`,
        ...getAnimationStyles()
      }}
      onClick={() => selectNode(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-selected={isSelected}
      aria-expanded={data.expanded}
      role="treeitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectNode(id);
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          !data.expanded && toggleNodeExpanded(id);
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          data.expanded && toggleNodeExpanded(id);
          e.preventDefault();
        }
      }}
    >
      {/* Radial spotlight effect that follows mouse */}
      {isHovered && !isMobile && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%)`,
            opacity: 0.8
          }}
        />
      )}
      
      <div className="flex items-center justify-between relative">
        <div 
          className="font-medium text-sm truncate backdrop-blur-0 flex-1 pr-2"
          style={{ color: textColor, textShadow: isDarkMode ? '0 1px 2px rgba(0,0,0,0.3)' : 'none' }}
        >
          {data.label}
        </div>
        
        <button 
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/30 active:bg-white/50 transition-all backdrop-blur-0 relative"
          onClick={handleExpand}
          aria-label={data.expanded ? "Collapse node" : "Expand node"}
          tabIndex={-1}
        >
          {data.expanded 
            ? <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ color: textColor }} /> 
            : <ChevronRight className="w-4 h-4 transition-transform duration-200" style={{ color: textColor }} />
          }
          
          {/* Button interaction effect */}
          <span className="absolute inset-0 rounded-full bg-white/0 hover:bg-white/20 active:bg-white/30 transition-colors duration-200" />
        </button>
      </div>
      
      {/* Small settings indicator when node is selected */}
      {isSelected && (
        <div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md animate-appear cursor-pointer hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            selectNode(id);
          }}
        >
          <Settings className="w-2.5 h-2.5" style={{ color: nodeColor }} />
        </div>
      )}
      
      {/* Middle connection node button with enhanced animation and better hitbox */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 flex items-center justify-center"
        onClick={handleAddMiddleNode}
        role="button"
        tabIndex={-1}
        aria-label="Add connected node"
      >
        <div className={`w-8 h-8 ${isDarkMode ? 'bg-white/90' : 'bg-white'} backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-neon`}>
          <Plus className="w-4 h-4" style={{ color: nodeColor }} />
          
          {/* Ping animation for the add button */}
          <span className={`absolute inset-0 rounded-full border-2 ${isDarkMode ? 'border-white' : `border-[${nodeColor}]`} animate-ping-slow opacity-40`} />
        </div>
      </div>
      
      {/* Inner glow effect with dynamic color */}
      <div 
        className="absolute inset-0 rounded-lg opacity-20 pointer-events-none transition-opacity duration-300" 
        style={{ 
          background: `radial-gradient(circle at center, ${adjustColor(nodeColor, 30)}, transparent 70%)`,
          opacity: isHovered ? 0.3 : 0.2
        }}
      />
      
      {/* Connection handles with enhanced styling */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className={`w-4 h-4 border-2 ${isDarkMode ? 'border-white/50' : 'border-white/80'} transition-all duration-300`}
          style={{ 
            backgroundColor: nodeColor,
            boxShadow: `0 0 5px ${nodeColor}80`,
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            opacity: isHovered ? 1 : 0.7
          }}
        />
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className={`w-4 h-4 border-2 ${isDarkMode ? 'border-white/50' : 'border-white/80'} transition-all duration-300`}
        style={{ 
          backgroundColor: nodeColor,
          boxShadow: `0 0 5px ${nodeColor}80`,
          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          opacity: isHovered ? 1 : 0.7
        }}
      />
      
      {/* Bottom border accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-lg overflow-hidden"
        style={{ background: `linear-gradient(to right, transparent, ${adjustColor(nodeColor, 20)}, transparent)` }}
      />
      
      {/* Priority indicator */}
      <PriorityIndicator priority={data.priority} isDarkMode={isDarkMode} />
      
      {/* Node notes indicator */}
      {data.notes && !data.attachment && (
        <div 
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md animate-appear cursor-pointer hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            selectNode(id);
          }}
          title={data.notes.length > 30 ? data.notes.substring(0, 30) + '...' : data.notes}
        >
          <span className="w-3 h-3 flex items-center justify-center" style={{ color: nodeColor }}>...</span>
        </div>
      )}
      
      {/* Attachment indicator */}
      {data.attachment && (
        <div 
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-white shadow-md animate-appear cursor-pointer hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            selectNode(id);
            if (data.attachment?.url) {
              window.open(data.attachment.url, '_blank', 'noopener,noreferrer');
            }
          }}
          title={data.attachment.title || data.attachment.url}
        >
          {data.attachment.type === 'link' && <Link className="w-3 h-3" style={{ color: nodeColor }} />}
          {data.attachment.type === 'image' && <Image className="w-3 h-3" style={{ color: nodeColor }} />}
          {data.attachment.type === 'file' && <FileText className="w-3 h-3" style={{ color: nodeColor }} />}
        </div>
      )}
      
      {/* Tags display - show on hover */}
      {data.tags && data.tags.length > 0 && isHovered && (
        <div 
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10 animate-fade-in pointer-events-none"
          style={{ minWidth: '100%' }}
        >
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-900/90' : 'bg-white'} shadow-md border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <Tag className="w-3 h-3 mr-1" style={{ color: nodeColor }} />
            <div className="flex flex-wrap gap-1 justify-center">
              {data.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                    isDarkMode 
                      ? 'bg-white/10 text-white/90' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
              {data.tags.length > 3 && (
                <span className={`text-[8px] ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>
                  +{data.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Enhanced color adjustment function with HSL support for more vibrant gradients
function adjustColor(color: string, amount: number): string {
  // If it's already a hex, convert to RGB
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Convert RGB to HSL for better color adjustments
    const hsl = rgbToHsl(r, g, b);
    
    // Adjust lightness
    hsl[2] = Math.max(0, Math.min(100, hsl[2] + amount));
    
    // Convert back to RGB
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
    
    // Convert RGB to hex
    return `#${Math.round(rgb[0]).toString(16).padStart(2, '0')}${Math.round(rgb[1]).toString(16).padStart(2, '0')}${Math.round(rgb[2]).toString(16).padStart(2, '0')}`;
  }
  return color; // Return the original color if not a hex value
}

// RGB to HSL conversion
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// HSL to RGB conversion
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r * 255, g * 255, b * 255];
}

export default MindNode;
