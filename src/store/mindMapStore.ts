
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { MindMapNode, MindMapEdge, MindMapState } from '../types/mindmap';

interface MindMapStore extends MindMapState {
  // Node actions
  addNode: (parentId: string | null, initialPosition?: { x: number, y: number }, connectionType?: 'standard' | 'middle') => void;
  updateNodePosition: (nodeId: string, position: { x: number, y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<MindMapNode['data']>) => void;
  deleteNode: (nodeId: string) => void;
  toggleNodeExpanded: (nodeId: string) => void;
  
  // Selection actions
  selectNode: (nodeId: string | null) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  
  // Mind map actions
  clearMindMap: () => void;
  importMindMap: (data: { nodes: MindMapNode[], edges: MindMapEdge[] }) => void;
  
  // Helper getters
  getChildNodes: (nodeId: string) => MindMapNode[];
}

const initialNode: MindMapNode = {
  id: 'root',
  type: 'root',
  data: { 
    label: 'Main Topic',
    expanded: true,
    color: '#9b87f5'
  },
  position: { x: 0, y: 0 }
};

const useMindMapStore = create<MindMapStore>()(
  persist(
    (set, get) => ({
      nodes: [initialNode],
      edges: [],
      selectedNodeId: null,
      searchQuery: '',
      
      addNode: (parentId, initialPosition, connectionType = 'standard') => {
        const newNodeId = nanoid();
        const parent = parentId 
          ? get().nodes.find(node => node.id === parentId) 
          : null;
        
        let position = initialPosition || { x: 0, y: 0 };
        if (parent && !initialPosition) {
          if (connectionType === 'middle') {
            // For middle connections, place the node slightly offset from parent
            position = { 
              x: parent.position.x + 50, 
              y: parent.position.y + 100
            };
          } else {
            // For standard connections, calculate position based on other children
            const childCount = get().getChildNodes(parentId).length;
            position = { 
              x: parent.position.x + 200, 
              y: parent.position.y + (childCount * 70) 
            };
          }
        }

        const newNode: MindMapNode = {
          id: newNodeId,
          type: 'child',
          data: { 
            label: 'New Topic',
            expanded: true,
          },
          position,
          parentId,
          connectionType
        };

        // Only create an edge if there's a parent
        const newEdge = parentId ? {
          id: `e-${parentId}-${newNodeId}`,
          source: parentId,
          target: newNodeId,
          style: connectionType === 'middle' ? { 
            stroke: '#6366F1', 
            strokeWidth: 2 
          } : undefined,
          animated: connectionType === 'middle'
        } : null;

        set(state => ({
          nodes: [...state.nodes, newNode],
          edges: newEdge ? [...state.edges, newEdge] : state.edges,
          selectedNodeId: newNodeId,
        }));
      },

      updateNodePosition: (nodeId, position) => {
        set(state => ({
          nodes: state.nodes.map(node => 
            node.id === nodeId ? { ...node, position } : node
          ),
        }));
      },

      updateNodeData: (nodeId, data) => {
        set(state => ({
          nodes: state.nodes.map(node => 
            node.id === nodeId 
              ? { ...node, data: { ...node.data, ...data } } 
              : node
          ),
        }));
      },

      deleteNode: (nodeId) => {
        const nodesToDelete = [nodeId];
        const getDescendants = (id: string) => {
          const children = get().nodes.filter(n => n.parentId === id);
          children.forEach(child => {
            nodesToDelete.push(child.id);
            getDescendants(child.id);
          });
        };
        
        getDescendants(nodeId);
        
        set(state => ({
          nodes: state.nodes.filter(node => !nodesToDelete.includes(node.id)),
          edges: state.edges.filter(
            edge => !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
          ),
          selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        }));
      },

      toggleNodeExpanded: (nodeId) => {
        set(state => ({
          nodes: state.nodes.map(node =>
            node.id === nodeId 
              ? { ...node, data: { ...node.data, expanded: !node.data.expanded } }
              : node
          ),
        }));
      },

      selectNode: (nodeId) => {
        set({ selectedNodeId: nodeId });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      clearMindMap: () => {
        set({ 
          nodes: [initialNode], 
          edges: [], 
          selectedNodeId: null 
        });
      },

      importMindMap: (data) => {
        set({ 
          nodes: data.nodes, 
          edges: data.edges,
          selectedNodeId: null 
        });
      },

      getChildNodes: (nodeId) => {
        return get().nodes.filter(node => node.parentId === nodeId);
      }
    }),
    {
      name: 'mind-map-storage',
    }
  )
);

export default useMindMapStore;
