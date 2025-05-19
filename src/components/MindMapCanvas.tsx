import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  NodeChange,
  Node,
  Edge,
  useNodesInitialized,
  NodeTypes,
  Panel,
  ConnectionMode,
  ReactFlowInstance,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useMindMapStore from '../store/mindMapStore';
import MindNode from './MindNode';
import { MindMapNode } from '../types/mindmap';
import { Maximize, Minimize, Search, X, Sun, Moon, Grid3X3, Grid, Zap, Cpu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const nodeTypes: NodeTypes = {
  mindNode: MindNode,
};

const MindMapCanvas = () => {
  const { 
    nodes: storeNodes, 
    edges: storeEdges, 
    updateNodePosition,
    selectNode,
    selectedNodeId,
    searchQuery,
    setSearchQuery,
  } = useMindMapStore();
  
  const reactFlowInstance = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);
  const isMobile = useIsMobile();
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  
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
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Filter nodes and edges based on search query
  const { nodes, edges } = useMemo(() => {
    if (!searchQuery) {
      return { nodes: storeNodes, edges: storeEdges };
    }
    
    const filteredNodeIds = storeNodes
      .filter(node => 
        node.data.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(node => node.id);
      
    // Also include parent nodes in the path to the matching nodes
    const nodeIdsToInclude = new Set(filteredNodeIds);
    let found = true;
    while (found) {
      found = false;
      
      for (const node of storeNodes) {
        if (nodeIdsToInclude.has(node.id) && node.parentId && !nodeIdsToInclude.has(node.parentId)) {
          nodeIdsToInclude.add(node.parentId);
          found = true;
        }
      }
    }
    
    return {
      nodes: storeNodes.filter(node => nodeIdsToInclude.has(node.id)),
      edges: storeEdges.filter(edge => 
        nodeIdsToInclude.has(edge.source) && nodeIdsToInclude.has(edge.target)
      ),
    };
  }, [storeNodes, storeEdges, searchQuery]);
  
  // Check if nodes actually need to be shown based on parent's expanded state
  const visibleNodes = useMemo(() => {
    const isVisible = new Set<string>(['root']);
    
    // Helper to check if a node should be visible based on parent's expanded state
    const checkVisibility = (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node?.parentId) return true;
      
      const parentNode = nodes.find(n => n.id === node.parentId);
      return parentNode?.data.expanded && isVisible.has(node.parentId);
    };
    
    // First pass: mark direct children of expanded nodes as visible
    nodes.forEach(node => {
      if (node.parentId && checkVisibility(node.id)) {
        isVisible.add(node.id);
      }
    });
    
    return nodes
      .filter(node => isVisible.has(node.id))
      .map(node => ({
        ...node,
        type: 'mindNode',
      }));
  }, [nodes]);
  
  // Edge styling
  const customEdgeStyles = useMemo(() => ({
    light: {
      stroke: '#475569',
      strokeWidth: 2,
      opacity: 0.8
    },
    dark: {
      stroke: '#94A3B8',
      strokeWidth: 2,
      opacity: 0.7
    }
  }), []);
  
  const visibleEdges = useMemo(() => {
    const edgeStyle = isDarkMode ? customEdgeStyles.dark : customEdgeStyles.light;
    
    const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
    return edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    ).map(edge => {
      const isSelected = edge.source === selectedNodeId || edge.target === selectedNodeId;
      const sourceNode = nodes.find(n => n.id === edge.source);
      const edgeColor = sourceNode?.data?.color || '#9b87f5';
      
      // Enhanced enterprise-level edge styling
      return {
        ...edge,
        animated: isSelected || edge.animated,
        style: {
          ...edge.style,
          ...edgeStyle,
          stroke: isSelected ? edgeColor : edgeStyle.stroke,
          strokeWidth: isSelected ? 2.5 : edgeStyle.strokeWidth,
          opacity: isSelected ? 1 : edgeStyle.opacity,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: isSelected ? edgeColor : edgeStyle.stroke,
        },
        type: performanceMode ? 'straight' : 'smoothstep'
      };
    });
  }, [visibleNodes, edges, selectedNodeId, nodes, isDarkMode, customEdgeStyles, performanceMode]);
  
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    // Handle node position changes
    changes.forEach(change => {
      if (change.type === 'position' && change.position && change.id) {
        updateNodePosition(change.id, change.position);
      }
    });
  }, [updateNodePosition]);
  
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);
  
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);
  
  // Fit view function to center the mind map
  const fitView = useCallback(() => {
    flowInstance?.fitView({ padding: 0.2, duration: 800 });
  }, [flowInstance]);
  
  // Center the view on the initial load and when switching to mobile
  const initialized = useRef(false);
  
  useEffect(() => {
    // Initial fit view
    if (nodesInitialized && !initialized.current) {
      initialized.current = true;
      setTimeout(() => {
        reactFlowInstance.fitView({ 
          padding: 0.4, // Increase padding to make nodes more visible on small screens
          duration: 800,
        });
      }, 100);
    }
    
    // Re-fit view when window is resized (especially important for mobile)
    const handleResize = () => {
      setTimeout(() => {
        reactFlowInstance.fitView({ 
          padding: isMobile ? 0.5 : 0.3,
          duration: 400,
        });
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [nodesInitialized, reactFlowInstance, isMobile]);
  
  // Re-fit view when screen orientation changes (mobile)
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        reactFlowInstance.fitView({ 
          padding: 0.4,
          duration: 400,
        });
      }, 200);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [reactFlowInstance]);
  
  // Clear search when escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, setSearchQuery]);
  
  return (
    <ReactFlow
      nodes={visibleNodes}
      edges={visibleEdges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      className="transition-colors"
      minZoom={0.2}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      fitView
      snapToGrid={snapToGrid}
      snapGrid={[15, 15]}
      connectionMode={ConnectionMode.Loose}
      proOptions={{ hideAttribution: true }}
      elementsSelectable={true}
      onInit={setFlowInstance}
      connectOnClick={true}
      onConnect={(params) => {
        const sourceNode = nodes.find(node => node.id === params.source);
        const targetNode = nodes.find(node => node.id === params.target);
        
        if (sourceNode && targetNode) {
          const newEdge = {
            id: `e-${params.source}-${params.target}`,
            source: params.source,
            target: params.target,
            style: {
              stroke: sourceNode?.data?.color || '#9b87f5',
              strokeWidth: 2
            }
          };
          
          useMindMapStore.setState(state => ({
            edges: [...state.edges, newEdge]
          }));
        }
      }}
    >
      <Background 
        color={isDarkMode ? "rgba(155, 135, 245, 0.3)" : "rgba(99, 102, 241, 0.2)"} 
        gap={24} 
        size={1.5}
      />
      
      {!isMobile && (
        <Controls 
          className={`glass backdrop-blur-md ${
            isDarkMode 
              ? 'bg-gray-900/90 shadow-lg shadow-purple-500/20 border-white/20' 
              : 'bg-white/90 shadow-lg shadow-gray-200/50 border-gray-200'
          } rounded-xl overflow-hidden border`}
          showInteractive={false}
        />
      )}
      
      {!isMobile && (
        <MiniMap 
          className={`glass backdrop-blur-md ${
            isDarkMode 
              ? 'bg-gray-900/90 shadow-lg shadow-purple-500/20 border-white/20' 
              : 'bg-white/90 shadow-lg shadow-gray-200/50 border-gray-200'
          } rounded-xl overflow-hidden border`}
          nodeColor={(node) => {
            const mindNode = nodes.find(n => n.id === node.id);
            return mindNode?.data?.color || '#9b87f5';
          }}
          maskColor={isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"}
        />
      )}
      
      {searchQuery && (
        <Panel 
          position="bottom-center" 
          className={`glass backdrop-blur-md rounded-xl px-6 py-3 border ${
            isDarkMode 
              ? 'bg-gray-900/90 shadow-lg shadow-purple-500/20 border-white/20' 
              : 'bg-white/90 shadow-lg shadow-gray-200/50 border-gray-200'
          } animate-slide-up mb-4`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Showing results for "<span className={`font-medium ${isDarkMode ? 'text-gradient' : 'text-purple-600'}`}>{searchQuery}</span>"
              <span className={`ml-3 px-2.5 py-0.5 ${
                isDarkMode 
                  ? 'bg-white/10 text-white' 
                  : 'bg-purple-100 text-purple-800'
              } rounded-full text-xs font-medium`}>
                {visibleNodes.length} nodes
              </span>
            </p>
            
            <button
              onClick={() => setSearchQuery('')}
              className={`p-1 rounded-full ${
                isDarkMode 
                  ? 'hover:bg-white/10 text-white/70' 
                  : 'hover:bg-gray-100 text-gray-500'
              } transition-colors`}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </Panel>
      )}
      
      {isMobile && (
        <Panel position="bottom-center" className="mb-4">
          <div className={`flex items-center justify-center gap-2 p-2 rounded-full ${
            isDarkMode 
              ? 'bg-gray-900/90 border-white/20' 
              : 'bg-white/90 border-gray-200'
          } backdrop-blur-md shadow-lg border`}>
            <button
              onClick={fitView}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? 'hover:bg-white/10 active:bg-white/20' 
                  : 'hover:bg-gray-100 active:bg-gray-200'
              } transition-colors`}
              aria-label="Fit view"
            >
              <Maximize className={`h-5 w-5 ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`} />
            </button>
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? 'hover:bg-white/10 active:bg-white/20' 
                  : 'hover:bg-gray-100 active:bg-gray-200'
              } transition-colors`}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? 
                <Minimize className={`h-5 w-5 ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`} /> : 
                <Maximize className={`h-5 w-5 ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`} />
              }
            </button>
          </div>
        </Panel>
      )}
      
      {/* Dark Mode Toggle - Bottom Right */}
      <Panel position="bottom-right" className="mb-4 mr-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <div className={`flex items-center ${isDarkMode ? 'glass dark' : 'glass light'} rounded-full p-1 shadow-lg animate-fade-in-scale`}>
              <button
                onClick={() => {
                  const rf = reactFlowInstance;
                  if (rf) {
                    const zoom = rf.getZoom();
                    rf.zoomTo(Math.max(0.2, zoom - 0.2), { duration: 300 });
                  }
                }}
                className={`p-2 rounded-full ${
                  isDarkMode 
                    ? 'hover:bg-white/10 active:bg-white/20 text-white/80' 
                    : 'hover:bg-gray-100 active:bg-gray-200 text-gray-700'
                } transition-colors`}
                aria-label="Zoom out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                onClick={fitView}
                className={`p-2 rounded-full ${
                  isDarkMode 
                    ? 'hover:bg-white/10 active:bg-white/20 text-white/80' 
                    : 'hover:bg-gray-100 active:bg-gray-200 text-gray-700'
                } transition-colors`}
                aria-label="Fit view"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {/* Enterprise Controls */}
          <div className={`flex items-center ${isDarkMode ? 'glass dark' : 'glass light'} rounded-full p-1 shadow-lg animate-fade-in-scale mr-2`}>
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? 'hover:bg-white/10 active:bg-white/20 text-white/80' 
                  : 'hover:bg-gray-100 active:bg-gray-200 text-gray-700'
              } transition-colors relative`}
              aria-label={snapToGrid ? "Disable grid snapping" : "Enable grid snapping"}
              title={snapToGrid ? "Disable grid snapping" : "Enable grid snapping"}
            >
              {snapToGrid ? (
                <Grid3X3 className="w-5 h-5 text-purple-400" />
              ) : (
                <Grid className="w-5 h-5" />
              )}
              {snapToGrid && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              )}
            </button>
            
            <button
              onClick={() => setPerformanceMode(!performanceMode)}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? 'hover:bg-white/10 active:bg-white/20 text-white/80' 
                  : 'hover:bg-gray-100 active:bg-gray-200 text-gray-700'
              } transition-colors relative`}
              aria-label={performanceMode ? "Disable performance mode" : "Enable performance mode"}
              title={performanceMode ? "Disable performance mode" : "Enable performance mode"}
            >
              {performanceMode ? (
                <Zap className="w-5 h-5 text-amber-400" />
              ) : (
                <Cpu className="w-5 h-5" />
              )}
              {performanceMode && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </div>
          
          <button
            onClick={() => {
              const newDarkMode = !isDarkMode;
              if (newDarkMode) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              setIsDarkMode(newDarkMode);
            }}
            className={`p-3 rounded-full transition-all shadow-lg ${
              isDarkMode 
                ? 'glass dark hover:bg-gray-800/90 animate-bounce-light' 
                : 'glass light hover:bg-gray-50/90'
              } border`}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 animate-pulse-slow text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </Panel>
    </ReactFlow>
  );
};

export default MindMapCanvas;
