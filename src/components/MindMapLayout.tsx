import { ReactFlowProvider } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { Moon, Sun, ArrowLeft, Sparkles, Layout, Grid, LayoutGrid, Clock, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

import MindMapCanvas from './MindMapCanvas';
import MindMapControls from './MindMapControls';
import NodeEditor from './NodeEditor';

const MindMapLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Set up dark mode
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
    
    // Create a mutation observer to detect class changes on the html element
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setDarkMode(isDarkMode);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setDarkMode(newDarkMode);
  };
  
  // Set proper viewport meta tag for mobile - important for rendering
  useEffect(() => {
    // Find or create the viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta') as HTMLMetaElement;
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set it to appropriate values for both mobile and desktop
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    return () => {
      // Clean up
      if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1.0';
      }
    };
  }, []);

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark bg-gray-900' : 'bg-white'} overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-purple-200 dark:bg-purple-900/20 filter blur-3xl opacity-20 dark:opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-200 dark:bg-blue-900/20 filter blur-3xl opacity-20 dark:opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 dark:from-purple-900/10 dark:via-transparent dark:to-blue-900/10 pointer-events-none"></div>
      </div>

      <div className="w-full h-full relative z-10">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`fixed top-4 right-4 z-50 p-2 rounded-lg ${
              darkMode 
                ? 'bg-white/10 text-white animate-fade-in-scale' 
                : 'bg-gray-100 text-gray-800 animate-fade-in-scale'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {/* Back to Home Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all animate-fade-in-scale ${
              darkMode 
                ? 'glass dark text-white hover:bg-white/20' 
                : 'glass light text-gray-900 hover:bg-gray-50'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
        
        <ReactFlowProvider>
          <div className="h-screen w-screen relative">
            <MindMapCanvas />
            {(!isMobile || !mobileMenuOpen) && <MindMapControls />}
            <NodeEditor />
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default MindMapLayout;
