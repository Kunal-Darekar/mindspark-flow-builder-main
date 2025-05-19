import { useEffect, useState, useRef, useCallback } from 'react';
import { Panel } from '@xyflow/react';
import useMindMapStore from '../store/mindMapStore';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  PaintBucket, 
  Palette, 
  Edit3, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Move, 
  Trash2, 
  X, 
  Link, 
  Image, 
  Paperclip,
  FileText,
  AlignLeft,
  Tag
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MindMapNode, NodeAttachment } from '@/types/mindmap';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Enhanced color palette with neon gradients
const colorOptions = [
  '#9b87f5', // Default purple
  '#67C9BB', // Teal
  '#FF9473', // Coral
  '#6C95FF', // Light Blue
  '#FFD700', // Gold
  '#FF66B3', // Pink
  '#A4D4AE', // Mint
  '#FF5252', // Red
  '#66D9EF', // Cyan
];

// Add these light mode specific classes
const lightModeClasses = {
  panel: "bg-white border-gray-200 shadow-md",
  input: "bg-white border-gray-200 text-gray-900",
  button: "bg-gray-50 hover:bg-gray-100 text-gray-900",
  label: "text-gray-700"
};

const NodeEditor = () => {
  const { nodes, selectedNodeId, updateNodeData, deleteNode } = useMindMapStore();
  const selectedNode = nodes.find(node => node.id === selectedNodeId);
  
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeColor, setNodeColor] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [animationType, setAnimationType] = useState('pulse');
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [attachment, setAttachment] = useState<NodeAttachment | undefined>(undefined);
  const [attachmentType, setAttachmentType] = useState<'image' | 'link' | 'file'>('link');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentTitle, setAttachmentTitle] = useState('');
  const [nodeNotes, setNodeNotes] = useState('');
  const [nodeTags, setNodeTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [nodePriority, setNodePriority] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Define all handler functions using useCallback to maintain consistent hook order
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;
    
    // Add boundary checks to keep panel visible within viewport
    const panelRect = panelRef.current?.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (panelRect) {
      // Keep at least 50px of panel visible on each edge
      const minX = -panelRect.width + 100;
      const maxX = viewportWidth - 100;
      const minY = 0;
      const maxY = viewportHeight - 100;
      
      const boundedX = Math.min(Math.max(newX, minX), maxX);
      const boundedY = Math.min(Math.max(newY, minY), maxY);
      
      setPosition({
        x: boundedX,
        y: boundedY
      });
    } else {
      setPosition({
        x: newX,
        y: newY
      });
    }
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
  }, []);

  // Handle mouse move during dragging
  useEffect(() => {
    if (isDragging) {
      const handleDragMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;
        
        // Keep the panel within viewport bounds
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buffer = 50; // Keep at least 50px of panel visible
        
        const panelWidth = panelRef.current?.offsetWidth || 320;
        const panelHeight = panelRef.current?.offsetHeight || 400;
        
        const boundedX = Math.min(Math.max(newX, -panelWidth + buffer), viewportWidth - buffer);
        const boundedY = Math.min(Math.max(newY, 0), viewportHeight - buffer);
        
        setPosition({
          x: boundedX,
          y: boundedY
        });
      };
      
      const handleDragMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = '';
      };
      
      document.addEventListener('mousemove', handleDragMouseMove);
      document.addEventListener('mouseup', handleDragMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMouseMove);
        document.removeEventListener('mouseup', handleDragMouseUp);
      };
    }
  }, [isDragging]);
  
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    
    dragStartPos.current = { 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    };
    
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  }, [position, isMobile]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNodeId) return;

    let processedAttachment: NodeAttachment | undefined = undefined;
    
    if (attachmentUrl) {
      processedAttachment = {
        type: attachmentType,
        url: attachmentUrl,
        title: attachmentTitle || attachmentUrl
      };
    }

    const updatedData: Partial<MindMapNode['data']> = {
      label: nodeLabel,
      color: nodeColor,
      animation: animationType,
      attachment: processedAttachment,
      notes: nodeNotes || undefined,
      tags: nodeTags.length > 0 ? nodeTags : undefined,
      priority: nodePriority
    };

    updateNodeData(selectedNodeId, updatedData);
    
    toast({
      title: 'Node Updated',
      description: 'Your changes have been saved',
      variant: 'default',
    });
  }, [selectedNodeId, nodeLabel, nodeColor, animationType, attachmentType, attachmentUrl, attachmentTitle, nodeNotes, nodeTags, nodePriority, updateNodeData, toast]);

  const handleDeleteNode = useCallback(() => {
    if (selectedNodeId && selectedNodeId !== 'root') {
      deleteNode(selectedNodeId);
    }
  }, [selectedNodeId, deleteNode]);

  const handleAddTag = useCallback(() => {
    if (!currentTag.trim()) return;
    
    // Don't add duplicate tags
    if (!nodeTags.includes(currentTag.trim())) {
      setNodeTags([...nodeTags, currentTag.trim()]);
    }
    
    setCurrentTag('');
  }, [currentTag, nodeTags]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault();
      handleAddTag();
    }
  }, [currentTag, handleAddTag]);

  const removeTag = useCallback((tag: string) => {
    setNodeTags(nodeTags.filter(t => t !== tag));
  }, [nodeTags]);

  // Add effect to track dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Update form when selection changes
  useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label);
      setNodeColor(selectedNode.data.color || colorOptions[0]);
      setAnimationType(selectedNode.data.animation || 'pulse');
      setAttachment(selectedNode.data.attachment);
      setAttachmentUrl(selectedNode.data.attachment?.url || '');
      setAttachmentTitle(selectedNode.data.attachment?.title || '');
      setAttachmentType(selectedNode.data.attachment?.type || 'link');
      setNodeNotes(selectedNode.data.notes || '');
      setNodeTags(selectedNode.data.tags || []);
      setNodePriority(selectedNode.data.priority);
    }
  }, [selectedNode]);
  
  // Reset position when selection changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [selectedNodeId]);
  
  if (!selectedNode) return null;
  
  const animationOptions = [
    { id: 'pulse', name: 'Pulse' },
    { id: 'float', name: 'Float' },
    { id: 'glow', name: 'Glow' },
    { id: 'none', name: 'None' }
  ];
  
  return (
    <Panel 
      position="top-right" 
      className={`glass backdrop-blur-xl rounded-xl p-5 min-w-[320px] animate-slide-down 
        ${isDarkMode ? 'shadow-neon border-white/20 bg-gray-900/80' : 'border border-gray-200 shadow-lg bg-white/90 light-mode-shadow'}
        ${isMobile ? 'w-[95%] max-w-md mx-auto mb-4' : ''}
      `}
      style={
        !isMobile ? { 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          zIndex: isDragging ? 10000 : 9999, // Higher z-index during dragging
          boxShadow: isDarkMode ? 
            (isDragging ? '0 0 25px rgba(155, 135, 245, 0.6)' : '0 0 20px rgba(155, 135, 245, 0.4)') : 
            (isDragging ? '0 10px 35px rgba(0, 0, 0, 0.18)' : '0 8px 30px rgba(0, 0, 0, 0.12)')
        } : { 
          zIndex: 9999,
          boxShadow: isDarkMode ? '0 0 20px rgba(155, 135, 245, 0.4)' : '0 8px 30px rgba(0, 0, 0, 0.12)'
        }
      }
      ref={panelRef}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative max-h-[80vh]">
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] flex flex-col gap-4 hide-scrollbar pr-2">
          <div 
            className={`flex items-center justify-between border-b ${isDarkMode ? 'border-white/10' : 'border-gray-300'} pb-3 ${!isMobile ? 'cursor-grab active:cursor-grabbing' : ''} sticky top-0 z-10 bg-inherit`}
            onMouseDown={!isMobile ? handleDragStart : undefined}
            onTouchStart={!isMobile ? (e) => {
              // Convert touch event to mouse event for drag
              const touch = e.touches[0];
              const mouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {}
              } as unknown as React.MouseEvent;
              handleDragStart(mouseEvent);
            } : undefined}
            style={{ touchAction: !isMobile ? 'none' : undefined }}
          >
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white text-neon' : 'text-gray-800'} flex items-center gap-2`}>
                <Edit3 className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                Edit Node
              </h3>
              <div className="relative">
                <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-yellow-300' : 'text-amber-500'} animate-pulse-slow absolute -top-1 -right-2`} />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isMobile && (
                <Move className={`w-4 h-4 ${isDarkMode ? 'text-white/60' : 'text-gray-500'} ${isDragging ? 'rotate-12 scale-110' : ''} transition-transform`} />
              )}
              <div className={`text-xs ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'} px-3 py-1.5 rounded-full backdrop-blur-sm border ${isDarkMode ? 'border-white/5' : 'border-gray-200'} shadow-sm`}>
                {selectedNode.id === 'root' ? 'Root' : 'Topic'}
              </div>
            </div>
          </div>
          
          {/* Basic Options */}
          <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-700'} font-medium flex items-center gap-1.5`}>
              <Edit3 className={`w-3.5 h-3.5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              Title
            </label>
            <div className="relative group">
              <input
                type="text"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:border-opacity-70 ${
                  isDarkMode 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/50' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter node title..."
                aria-label="Node title"
              />
              <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 rounded-md pointer-events-none transition-opacity duration-500 ${
                isDarkMode ? 'from-purple-500/0 via-purple-500/30 to-purple-500/0' : 'from-purple-100 via-purple-200 to-purple-100'
              }`}></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-700'} font-medium flex items-center gap-1.5`}>
              <PaintBucket className={`w-3.5 h-3.5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              Color
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNodeColor(color)}
                  className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center ${
                    nodeColor === color 
                      ? isDarkMode
                        ? 'ring-2 ring-offset-2 ring-white/70 scale-110 shadow-neon' 
                        : 'ring-2 ring-offset-2 ring-purple-400 scale-110 shadow-neon-light'
                      : 'hover:scale-105'
                  }`}
                  style={{ 
                    backgroundColor: color,
                    boxShadow: nodeColor === color 
                      ? isDarkMode
                        ? `0 0 10px ${color}80` 
                        : `0 0 8px ${color}40, 0 0 0 1px ${color}30`
                      : isDarkMode
                        ? `0 0 5px ${color}40` 
                        : `0 0 3px ${color}30, 0 0 0 1px ${color}20`
                  }}
                  aria-label={`Select color ${color}`}
                  aria-pressed={nodeColor === color}
                >
                  {nodeColor === color && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                </button>
              ))}
            </div>
          </div>
          
            <div className="flex flex-col gap-2">
              <label className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-700'} font-medium flex items-center gap-1.5`}>
                <Tag className={`w-3.5 h-3.5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                Priority
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNodePriority('low')}
                  className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
                    ${nodePriority === 'low'
                      ? isDarkMode
                        ? 'bg-green-500/40 text-white border border-green-500/40'
                        : 'bg-green-100 text-green-800 border border-green-200'
                      : isDarkMode
                        ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setNodePriority('medium')}
                  className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
                    ${nodePriority === 'medium'
                      ? isDarkMode
                        ? 'bg-blue-500/40 text-white border border-blue-500/40'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                      : isDarkMode
                        ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setNodePriority('high')}
                  className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
                    ${nodePriority === 'high'
                      ? isDarkMode
                        ? 'bg-red-500/40 text-white border border-red-500/40'
                        : 'bg-red-100 text-red-800 border border-red-200'
                      : isDarkMode
                        ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  High
                </button>
                {nodePriority && (
                  <button
                    type="button"
                    onClick={() => setNodePriority(undefined)}
                    className={`px-2 rounded text-xs transition-all duration-200
                      ${isDarkMode
                        ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <button 
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                Advanced Options
              </span>
              {isAdvancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isAdvancedOpen && (
              <div className="space-y-4 pt-2 pb-20">
              <div className="flex flex-col gap-2">
                  <label className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-700'} font-medium flex items-center gap-1.5`}>
                    <Sparkles className={`w-3.5 h-3.5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                    Animation
                  </label>
                <div className="grid grid-cols-2 gap-2">
                  {animationOptions.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAnimationType(option.id)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 ${
                        animationType === option.id
                            ? isDarkMode
                              ? 'bg-purple-500/40 text-white border border-purple-500/40' 
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                            : isDarkMode
                              ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                              : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-700'} font-medium flex items-center gap-1.5`}>
                    <AlignLeft className={`w-3.5 h-3.5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                    Notes
                  </label>
                  <Textarea
                    value={nodeNotes}
                    onChange={(e) => setNodeNotes(e.target.value)}
                    placeholder="Add notes about this topic..."
                    className={`min-h-[80px] ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-700'} font-medium flex items-center gap-1.5`}>
                    <Paperclip className={`w-3.5 h-3.5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                    Attachment
                  </label>
                  
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setAttachmentType('link')}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1 ${
                        attachmentType === 'link'
                          ? isDarkMode
                            ? 'bg-blue-500/40 text-white border border-blue-500/40' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                          : isDarkMode
                            ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Link className="w-3 h-3" />
                      Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttachmentType('image')}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1 ${
                        attachmentType === 'image'
                          ? isDarkMode
                            ? 'bg-green-500/40 text-white border border-green-500/40' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                          : isDarkMode
                            ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Image className="w-3 h-3" />
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttachmentType('file')}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1 ${
                        attachmentType === 'file'
                          ? isDarkMode
                            ? 'bg-amber-500/40 text-white border border-amber-500/40' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                          : isDarkMode
                            ? 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      File
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Input
                      type="text"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      placeholder={
                        attachmentType === 'link' ? "Enter URL..." :
                        attachmentType === 'image' ? "Enter image URL..." :
                        "Enter file URL..."
                      }
                      className={`${
                        isDarkMode 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    
                    <Input
                      type="text"
                      value={attachmentTitle}
                      onChange={(e) => setAttachmentTitle(e.target.value)}
                      placeholder="Title (optional)"
                      className={`${
                        isDarkMode 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  
                  {attachmentUrl && attachmentType === 'image' && (
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                      <div className="aspect-video w-full rounded overflow-hidden bg-black/20 flex items-center justify-center">
                        <img 
                          src={attachmentUrl} 
                          alt={attachmentTitle || 'Image preview'} 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/9b87f5/ffffff?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                      <p className={`text-xs mt-2 text-center ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>
                        Image Preview
                      </p>
                    </div>
                  )}
                  
                  {attachmentUrl && attachmentType === 'link' && (
                    <div className={`mt-2 p-3 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} flex items-center gap-2`}>
                      <Link className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                      <a 
                        href={attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-xs font-medium truncate ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        {attachmentTitle || attachmentUrl}
                      </a>
                    </div>
                  )}
                  
                  {attachmentUrl && attachmentType === 'file' && (
                    <div className={`mt-2 p-3 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} flex items-center gap-2`}>
                      <FileText className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                      <a 
                        href={attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-xs font-medium truncate ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        {attachmentTitle || attachmentUrl}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-700'} font-medium flex items-center gap-1.5`}>
                    <Tag className={`w-3.5 h-3.5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                    Tags
                  </label>
                  
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add tag..."
                      className={`flex-1 ${
                        isDarkMode 
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!currentTag.trim()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                        currentTag.trim()
                          ? isDarkMode
                            ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                          : isDarkMode
                            ? 'bg-white/5 text-white/40 cursor-not-allowed' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                  
                  {nodeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {nodeTags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant={isDarkMode ? 'outline' : 'secondary'}
                          className="px-2 py-0.5 gap-1 group"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                              isDarkMode
                                ? 'hover:bg-white/20 text-white/80'
                                : 'hover:bg-gray-300 text-gray-500'
                            } transition-colors`}
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons - Always visible at bottom */}
        <div className={`flex justify-between sticky bottom-0 left-0 right-0 pt-4 mt-4 border-t z-20 ${
          isDarkMode ? 'border-white/10 bg-gray-900/95' : 'border-gray-200 bg-white/95'
        } backdrop-blur-md`}>
          <button
            type="button"
            onClick={handleDeleteNode}
            disabled={selectedNodeId === 'root'}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedNodeId === 'root'
                ? isDarkMode
                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30' 
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Delete</span>
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Save Changes</span>
          </button>
        </div>
      </form>
    </Panel>
  );
};

export default NodeEditor;
