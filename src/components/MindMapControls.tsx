import { useState, useEffect, useCallback, useRef } from 'react';
import { Panel } from '@xyflow/react';
import { Search, ZoomIn, ZoomOut, Plus, Trash2, Download, Upload, Sparkles, Sun, Moon, Info, X, FileIcon, Image, FilePlus, LayoutTemplate } from 'lucide-react';
import useMindMapStore from '../store/mindMapStore';
import { MindMapNode, MindMapEdge } from '../types/mindmap';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import TemplateSelector from './TemplateSelector';

interface ControlButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  title?: string;
  variant?: 'default' | 'primary' | 'destructive' | 'outline';
}

const ControlButton = ({ 
  children, 
  onClick, 
  className = "", 
  title,
  variant = 'default'
}: ControlButtonProps) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const getVariantClasses = () => {
    switch(variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-md';
      case 'destructive':
        return 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md';
      case 'outline':
        return `border ${isDarkMode ? 'border-white/20 text-white/80' : 'border-gray-300 text-gray-700'} hover:bg-white/10`;
      default:
        return `${isDarkMode 
          ? 'bg-white/10 hover:bg-white/15 text-white' 
          : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'}`;
    }
  };
  
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2.5 transition-all duration-300 rounded-md backdrop-blur-sm hover:scale-105
        ${getVariantClasses()}
        ${className}`}
    >
      {children}
    </button>
  );
};

const MindMapControls = () => {
  const { 
    nodes, 
    edges, 
    searchQuery, 
    selectedNodeId,
    addNode, 
    deleteNode,
    setSearchQuery,
    clearMindMap, 
    importMindMap
  } = useMindMapStore();
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const isMobile = useIsMobile();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // Check dark mode on mount and subscribe to changes
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
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
    // The actual zoom is handled by ReactFlow
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
    // The actual zoom is handled by ReactFlow
  };
  
  const handleExport = useCallback((format: 'json' | 'png' | 'pdf') => {
    if (format === 'json') {
      const data = {
        nodes,
        edges,
        meta: {
          exportedAt: new Date().toISOString(),
          version: '1.0'
        }
      };
      
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileName = `mindflow_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
      
      toast({
        title: 'Export Successful',
        description: `Your mind map has been exported as ${exportFileName}`,
        variant: 'default',
      });
    } else if (format === 'png') {
      // PNG export using html-to-image library
      // Note: We would need to use a library like html-to-image here
      // but we'll add a toast to indicate this feature is coming soon
      toast({
        title: 'Coming Soon',
        description: 'PNG export will be available in the next update!',
        variant: 'default',
      });
    } else if (format === 'pdf') {
      // PDF export
      toast({
        title: 'Coming Soon',
        description: 'PDF export will be available in the next update!',
        variant: 'default',
      });
    }
    
    setShowExportOptions(false);
  }, [nodes, edges, toast]);
  
  const handleImport = () => {
    try {
      setImportError('');
      const data = JSON.parse(importData);
      
      if (!data.nodes || !data.edges || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
        throw new Error('Invalid mind map data format');
      }
      
      importMindMap(data);
      setImportDialogOpen(false);
      setImportData('');
      
      toast({
        title: 'Import Successful',
        description: `Imported mind map with ${data.nodes.length} nodes`,
        variant: 'default',
      });
    } catch (error) {
      setImportError('Invalid JSON data. Please check the format and try again.');
    }
  };
  
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setImportData(content);
      } catch (error) {
        setImportError('Error reading file. Please try again.');
      }
    };
    reader.readAsText(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Add node on Ctrl+N (or Cmd+N on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addNode(selectedNodeId || 'root');
      }
      
      // Delete node on Delete key when a node is selected
      if (e.key === 'Delete' && selectedNodeId && selectedNodeId !== 'root') {
        deleteNode(selectedNodeId);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [addNode, deleteNode, selectedNodeId]);
  
  // Small tips that appear when showTips is true
  const tips = [
    { text: "Press Ctrl+N to add a new node", icon: <Plus className="w-3.5 h-3.5" /> },
    { text: "Press Delete to remove selected node", icon: <Trash2 className="w-3.5 h-3.5" /> },
    { text: "Click and drag nodes to rearrange", icon: <Sparkles className="w-3.5 h-3.5" /> }
  ];
  
  return (
    <div className="flex flex-col gap-6 p-4">
      <Panel 
        position="top-left" 
        className={`glass ${darkMode ? 'dark animate-glow-pulse' : 'light'} rounded-xl p-5 flex flex-col gap-4 min-w-[250px] 
          ${isMobile ? 'w-[85vw] max-w-[350px] mt-20' : 'min-w-[280px] mt-16'}
          animate-fade-in-scale
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <h3 className={`font-semibold ${darkMode ? 'text-white text-neon' : 'text-gray-800'}`}>Mind Map Builder</h3>
            <div className="animate-shimmer w-5 h-5 rounded-full opacity-60 absolute left-[190px]"></div>
          </div>
          
          {showTips && (
            <button 
              onClick={() => setShowTips(false)}
              className="text-white/60 hover:text-white/90 transition-colors p-1.5 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {!showTips && (
            <button 
              onClick={() => setShowTips(true)}
              title="View keyboard shortcuts"
              className="text-white/60 hover:text-white/90 transition-colors p-1.5 rounded-full hover:bg-white/10"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Tips and shortcuts panel that slides down when shown */}
        {showTips && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 animate-slide-down text-sm">
            <h4 className="text-white/90 font-medium mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              Keyboard Shortcuts
            </h4>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70">
                  {tip.icon}
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-white/60' : 'text-gray-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className={`pl-9 pr-4 py-2.5 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm
              ${darkMode 
                ? 'bg-white/10 border border-white/20 text-white placeholder-white/50' 
                : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 
              text-white transition-all duration-300 rounded-md w-full shadow-lg hover:shadow-neon hover:scale-[1.02]`}
            onClick={() => addNode(selectedNodeId || 'root')}
          >
            <Plus className="h-4 w-4 text-white" />
            <span className="text-sm font-medium">Add Node</span>
          </button>
          
          {selectedNodeId && selectedNodeId !== 'root' && (
            <button
              className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 
                text-white transition-all duration-300 rounded-md w-full shadow-lg hover:shadow-neon-pink hover:scale-[1.02]`}
              onClick={() => deleteNode(selectedNodeId)}
            >
              <Trash2 className="h-4 w-4 text-white" />
              <span className="text-sm font-medium">Delete Selected</span>
            </button>
          )}

          {/* Feature teaser buttons - these are just UI, actual functionality would need implementation */}
          <button
            className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-300 rounded-md w-full backdrop-blur-sm shadow-sm
              ${darkMode 
                ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10' 
                : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
              }`}
          >
            <Sparkles className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-purple-500'}`} />
            <span className="text-sm font-medium">Add Task List</span>
          </button>
        </div>
        
        <div className={`flex items-center justify-between pt-3 mt-1 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <ControlButton onClick={() => setShowExportOptions(prev => !prev)}>
              <Download className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
            </ControlButton>
            
            <ControlButton 
              onClick={() => setImportDialogOpen(true)}
              className={darkMode ? 'bg-green-500/30 hover:bg-green-500/40' : 'bg-green-100 hover:bg-green-200 text-green-700'}
              title="Import Mind Map"
            >
              <Upload className="h-4 w-4 text-white" />
            </ControlButton>
          </div>
        </div>
      </Panel>
      
      {showExportOptions && (
        <div 
          className={`absolute top-full left-0 mt-1 p-2 rounded-lg ${
            darkMode 
              ? 'bg-white/10 backdrop-blur-xl border-white/20 shadow-neon' 
              : 'bg-white backdrop-blur-md border-gray-200 shadow-lg'
            } border w-full z-50 animate-slide-down overflow-hidden`}
        >
          <div className="flex flex-col gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleExport('json')}
              className={`flex items-center justify-start pl-2 ${
                darkMode 
                  ? 'hover:bg-white/10 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
                }`}
            >
              <FileIcon className="h-4 w-4 mr-1.5" />
              <span className="text-xs">JSON</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleExport('png')}
              className={`flex items-center justify-start pl-2 ${
                darkMode 
                  ? 'hover:bg-white/10 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
                }`}
            >
              <Image className="h-4 w-4 mr-1.5" />
              <span className="text-xs">PNG</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleExport('pdf')}
              className={`flex items-center justify-start pl-2 ${
                darkMode 
                  ? 'hover:bg-white/10 text-white' 
                  : 'hover:bg-gray-100 text-gray-800'
                }`}
            >
              <FilePlus className="h-4 w-4 mr-1.5" />
              <span className="text-xs">PDF</span>
            </Button>
          </div>
        </div>
      )}
      
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className={`flex-1 ${
              darkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
              } transition-colors duration-200`}
          >
            <Upload className="h-4 w-4 mr-1.5" />
            <span>Import</span>
          </Button>
        </DialogTrigger>
        <DialogContent className={`${darkMode ? 'dark-dialog' : ''}`}>
          <DialogHeader>
            <DialogTitle>Import Mind Map</DialogTitle>
            <DialogDescription>
              Upload a JSON file or paste your mind map data below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              onClick={triggerFileInput}
              variant="outline"
              className={`w-full ${darkMode ? 'border-white/20 text-white' : ''}`}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select JSON File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            
            <div className="relative">
              <textarea
                className={`w-full h-40 p-3 rounded-md ${
                  darkMode 
                    ? 'bg-white/5 border-white/20 text-white' 
                    : 'border-gray-300'
                  } resize-none`}
                placeholder="Paste JSON mind map data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
              {importData && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => setImportData('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {importError && (
              <p className="text-red-500 text-sm">{importError}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!importData}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={`w-full ${
              darkMode 
                ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
                : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300'
              } transition-colors duration-200`}
          >
            <LayoutTemplate className="h-4 w-4 mr-1.5" />
            <span>Templates</span>
          </Button>
        </DialogTrigger>
        <DialogContent className={`${darkMode ? 'dark-dialog' : ''} sm:max-w-[700px]`}>
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Select a template to jumpstart your mind map
            </DialogDescription>
          </DialogHeader>
          <TemplateSelector onClose={() => setTemplateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindMapControls;
