import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, LayoutTemplate } from 'lucide-react';
import useMindMapStore from '@/store/mindMapStore';
import { MindMapTemplate } from '@/types/mindmap';
import { useToast } from '@/hooks/use-toast';

interface TemplateSelectorProps {
  onClose?: () => void;
}

const TemplateSelector = ({ onClose }: TemplateSelectorProps) => {
  const { getAvailableTemplates, applyTemplate } = useMindMapStore();
  const templates = getAvailableTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  const handleApplyTemplate = useCallback(() => {
    if (!selectedTemplate) {
      toast({
        title: 'No Template Selected',
        description: 'Please select a template first',
        variant: 'destructive',
      });
      return;
    }
    
    applyTemplate(selectedTemplate);
    
    toast({
      title: 'Template Applied',
      description: 'The selected template has been applied to your mind map',
    });
    
    if (onClose) onClose();
  }, [selectedTemplate, applyTemplate, toast, onClose]);

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-300 group
              ${selectedTemplate === template.id 
                ? isDarkMode
                  ? 'border-purple-400 bg-purple-800/20 shadow-[0_0_15px_rgba(155,135,245,0.3)]' 
                  : 'border-purple-400 bg-purple-50 shadow-md' 
                : isDarkMode
                  ? 'border-white/10 bg-white/5 hover:bg-white/10'
                  : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/50'
              }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-purple-500' : 'bg-purple-600'
              }`}>
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            
            <div className="flex items-start gap-3">
              {template.previewImage ? (
                <div 
                  className={`w-16 h-16 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'} flex items-center justify-center overflow-hidden flex-shrink-0`}
                >
                  <img 
                    src={template.previewImage} 
                    alt={template.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className={`w-16 h-16 rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                  <LayoutTemplate className={`w-8 h-8 ${isDarkMode ? 'text-white/60' : 'text-gray-400'}`} />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className={`font-medium text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {template.name}
                </h3>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>
                  {template.description}
                </p>
                <div className="flex flex-wrap mt-2 gap-1">
                  {template.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant={isDarkMode ? 'outline' : 'secondary'} 
                      className={`text-[10px] px-1.5 py-0 ${isDarkMode ? 'text-white/70 border-white/20' : 'text-gray-700'}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`mt-3 text-xs ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                {template.nodes.length} Nodes
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <DialogFooter className="mt-6">
        <Button 
          variant="outline" 
          onClick={onClose}
          className={isDarkMode ? 'border-white/20 text-white' : ''}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleApplyTemplate}
          disabled={!selectedTemplate}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Apply Template
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TemplateSelector; 