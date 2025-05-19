import { MindMapTemplate } from '@/types/mindmap';
import { nanoid } from 'nanoid';

export const mindMapTemplates: MindMapTemplate[] = [
  {
    id: 'project-planning',
    name: 'Project Planning',
    description: 'Structure your project with goals, resources, timeline, and potential challenges.',
    tags: ['Business', 'Planning', 'Project Management'],
    nodes: [
      {
        id: 'root',
        type: 'root',
        data: {
          label: 'Project Name',
          expanded: true,
          color: '#9b87f5',
        },
        position: { x: 0, y: 0 },
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Goals',
          expanded: true,
          color: '#00A3FF',
        },
        position: { x: 250, y: -150 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Primary Objective',
          expanded: false,
          color: '#00A3FF',
        },
        position: { x: 450, y: -180 },
        parentId: 'goals',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Secondary Objectives',
          expanded: false,
          color: '#00A3FF',
        },
        position: { x: 450, y: -120 },
        parentId: 'goals',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Resources',
          expanded: true,
          color: '#1DA090',
        },
        position: { x: 250, y: -50 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Budget',
          expanded: false,
          color: '#1DA090',
          priority: 'high',
        },
        position: { x: 450, y: -80 },
        parentId: 'resources',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Team',
          expanded: false,
          color: '#1DA090',
        },
        position: { x: 450, y: -20 },
        parentId: 'resources',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Timeline',
          expanded: true,
          color: '#FF9473',
        },
        position: { x: 250, y: 50 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Phase 1',
          expanded: false,
          color: '#FF9473',
          priority: 'medium',
        },
        position: { x: 450, y: 20 },
        parentId: 'timeline',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Phase 2',
          expanded: false,
          color: '#FF9473',
          priority: 'low',
        },
        position: { x: 450, y: 80 },
        parentId: 'timeline',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Challenges',
          expanded: true,
          color: '#DE4D86',
        },
        position: { x: 250, y: 150 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Risks',
          expanded: false,
          color: '#DE4D86',
        },
        position: { x: 450, y: 120 },
        parentId: 'challenges',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Mitigation Strategies',
          expanded: false,
          color: '#DE4D86',
        },
        position: { x: 450, y: 180 },
        parentId: 'challenges',
      },
    ],
    edges: [],
    previewImage: 'https://placehold.co/100x100/9b87f5/FFF?text=Project'
  },
  {
    id: 'brainstorming',
    name: 'Brainstorming',
    description: 'Generate ideas around a central concept with different categories and associations.',
    tags: ['Creative', 'Ideas', 'Thinking'],
    nodes: [
      {
        id: 'root',
        type: 'root',
        data: {
          label: 'Central Idea',
          expanded: true,
          color: '#9b87f5',
        },
        position: { x: 0, y: 0 },
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Category 1',
          expanded: true,
          color: '#FF9473',
        },
        position: { x: 250, y: -120 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Idea 1.1',
          expanded: false,
          color: '#FF9473',
        },
        position: { x: 450, y: -150 },
        parentId: 'category-1',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Idea 1.2',
          expanded: false,
          color: '#FF9473',
        },
        position: { x: 450, y: -90 },
        parentId: 'category-1',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Category 2',
          expanded: true,
          color: '#1DA090',
        },
        position: { x: 250, y: 0 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Idea 2.1',
          expanded: false,
          color: '#1DA090',
        },
        position: { x: 450, y: -30 },
        parentId: 'category-2',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Idea 2.2',
          expanded: false,
          color: '#1DA090',
        },
        position: { x: 450, y: 30 },
        parentId: 'category-2',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Category 3',
          expanded: true,
          color: '#FFC144',
        },
        position: { x: 250, y: 120 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Idea 3.1',
          expanded: false,
          color: '#FFC144',
        },
        position: { x: 450, y: 90 },
        parentId: 'category-3',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Idea 3.2',
          expanded: false,
          color: '#FFC144',
        },
        position: { x: 450, y: 150 },
        parentId: 'category-3',
      },
    ],
    edges: [],
    previewImage: 'https://placehold.co/100x100/FF9473/FFF?text=Ideas'
  },
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    description: 'Analyze Strengths, Weaknesses, Opportunities, and Threats for strategic planning.',
    tags: ['Business', 'Analysis', 'Strategy'],
    nodes: [
      {
        id: 'root',
        type: 'root',
        data: {
          label: 'SWOT Analysis',
          expanded: true,
          color: '#9b87f5',
        },
        position: { x: 0, y: 0 },
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Strengths',
          expanded: true,
          color: '#1DA090',
          tags: ['Internal', 'Positive'],
        },
        position: { x: 250, y: -150 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Strength 1',
          expanded: false,
          color: '#1DA090',
        },
        position: { x: 450, y: -180 },
        parentId: 'strengths',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Strength 2',
          expanded: false,
          color: '#1DA090',
        },
        position: { x: 450, y: -120 },
        parentId: 'strengths',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Weaknesses',
          expanded: true,
          color: '#DE4D86',
          tags: ['Internal', 'Negative'],
        },
        position: { x: 250, y: -50 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Weakness 1',
          expanded: false,
          color: '#DE4D86',
        },
        position: { x: 450, y: -80 },
        parentId: 'weaknesses',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Weakness 2',
          expanded: false,
          color: '#DE4D86',
        },
        position: { x: 450, y: -20 },
        parentId: 'weaknesses',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Opportunities',
          expanded: true,
          color: '#00A3FF',
          tags: ['External', 'Positive'],
        },
        position: { x: 250, y: 50 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Opportunity 1',
          expanded: false,
          color: '#00A3FF',
        },
        position: { x: 450, y: 20 },
        parentId: 'opportunities',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Opportunity 2',
          expanded: false,
          color: '#00A3FF',
        },
        position: { x: 450, y: 80 },
        parentId: 'opportunities',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Threats',
          expanded: true,
          color: '#FF9473',
          tags: ['External', 'Negative'],
        },
        position: { x: 250, y: 150 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Threat 1',
          expanded: false,
          color: '#FF9473',
        },
        position: { x: 450, y: 120 },
        parentId: 'threats',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Threat 2',
          expanded: false,
          color: '#FF9473',
        },
        position: { x: 450, y: 180 },
        parentId: 'threats',
      },
    ],
    edges: [],
    previewImage: 'https://placehold.co/100x100/00A3FF/FFF?text=SWOT'
  },
  {
    id: 'goal-setting',
    name: 'Goal Setting',
    description: 'Plan your goals with objectives, action steps, and milestones for success.',
    tags: ['Planning', 'Personal', 'Achievement'],
    nodes: [
      {
        id: 'root',
        type: 'root',
        data: {
          label: 'Main Goal',
          expanded: true,
          color: '#9b87f5',
        },
        position: { x: 0, y: 0 },
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Objective 1',
          expanded: true,
          color: '#FFC144',
          priority: 'high',
        },
        position: { x: 250, y: -100 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Action 1.1',
          expanded: false,
          color: '#FFC144',
        },
        position: { x: 450, y: -130 },
        parentId: 'objective-1',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Action 1.2',
          expanded: false,
          color: '#FFC144',
        },
        position: { x: 450, y: -70 },
        parentId: 'objective-1',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Objective 2',
          expanded: true,
          color: '#00A3FF',
          priority: 'medium',
        },
        position: { x: 250, y: 0 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Action 2.1',
          expanded: false,
          color: '#00A3FF',
        },
        position: { x: 450, y: -30 },
        parentId: 'objective-2',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Action 2.2',
          expanded: false,
          color: '#00A3FF',
        },
        position: { x: 450, y: 30 },
        parentId: 'objective-2',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Milestones',
          expanded: true,
          color: '#1DA090',
        },
        position: { x: 250, y: 100 },
        parentId: 'root',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Milestone 1',
          expanded: false,
          color: '#1DA090',
          notes: 'Complete by the end of month 1',
        },
        position: { x: 450, y: 70 },
        parentId: 'milestones',
      },
      {
        id: nanoid(),
        type: 'child',
        data: {
          label: 'Milestone 2',
          expanded: false,
          color: '#1DA090',
          notes: 'Complete by the end of month 2',
        },
        position: { x: 450, y: 130 },
        parentId: 'milestones',
      },
    ],
    edges: [],
    previewImage: 'https://placehold.co/100x100/1DA090/FFF?text=Goals'
  }
];

export default mindMapTemplates; 