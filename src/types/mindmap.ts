export interface MindMapNode {
  id: string;
  type: 'root' | 'child' | 'middle';
  data: {
    label: string;
    expanded: boolean;
    color?: string;
    animation?: string;
    attachment?: NodeAttachment;
    notes?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
  };
  position: {
    x: number;
    y: number;
  };
  parentId?: string;
  connectionType?: 'standard' | 'middle';
}

export interface NodeAttachment {
  type: 'image' | 'link' | 'file';
  url: string;
  title?: string;
  preview?: string;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
  label?: string;
  type?: 'standard' | 'custom';
}

export interface MindMapState {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  selectedNodeId: string | null;
  searchQuery: string;
  theme?: string;
}

export interface MindMapTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  previewImage?: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}
