import React, { useEffect, useRef, useState } from 'react';

interface CanvasEditorProps {
  book: {
    title: string;
    author: string;
  };
  aiSummary: {
    overview: string;
    themes: string[];
    engagement: string;
    criticalThinking: string;
    emotionalResponse: string;
    keyTakeaways: string[];
    suggestedReflections: string[];
  };
}

interface ElementConfig {
  id: string;
  type: 'text' | 'pill' | 'section';
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  text?: string;
  selected?: boolean;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ book, aiSummary }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<ElementConfig[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);

  // Initialize canvas with basic elements
  useEffect(() => {
    if (!canvasRef.current) return;

    const initialElements: ElementConfig[] = [
      {
        id: 'title',
        type: 'text',
        x: 40,
        y: 60,
        fontSize: 32,
        color: '#065f46',
        text: book.title
      },
      {
        id: 'author',
        type: 'text',
        x: 40,
        y: 100,
        fontSize: 24,
        color: '#065f46',
        text: `by ${book.author}`
      },
      // Add more initial elements as needed
    ];

    setElements(initialElements);
  }, [book]);

  // Draw function
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    elements.forEach(element => {
      ctx.save();
      
      if (element.type === 'text') {
        ctx.font = `${element.fontSize}px system-ui`;
        ctx.fillStyle = element.color || '#000000';
        ctx.fillText(element.text || '', element.x, element.y);
      }
      
      // Draw selection indicator
      if (element.selected) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        const metrics = ctx.measureText(element.text || '');
        ctx.strokeRect(
          element.x - 4,
          element.y - (element.fontSize || 0) + 4,
          metrics.width + 8,
          (element.fontSize || 0) + 8
        );
      }
      
      ctx.restore();
    });
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Find clicked element
    const clicked = elements.find(element => {
      if (element.type === 'text') {
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        
        ctx.font = `${element.fontSize}px system-ui`;
        const metrics = ctx.measureText(element.text || '');
        return (
          x >= element.x &&
          x <= element.x + metrics.width &&
          y >= element.y - (element.fontSize || 0) &&
          y <= element.y
        );
      }
      return false;
    });

    if (clicked) {
      setSelectedElement(clicked.id);
      setIsDragging(true);
      setElements(elements.map(el => ({
        ...el,
        selected: el.id === clicked.id
      })));
    } else {
      setSelectedElement(null);
      setElements(elements.map(el => ({
        ...el,
        selected: false
      })));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setElements(elements.map(el => 
      el.id === selectedElement
        ? { ...el, x, y }
        : el
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Update canvas when elements change
  useEffect(() => {
    draw();
  }, [elements, scale]);

  // Export configuration
  const exportConfig = () => {
    const config = {
      elements,
      scale
    };
    console.log('Export configuration:', config);
    // You can save this to a file or copy to clipboard
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 space-x-4">
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded"
          onClick={exportConfig}
        >
          Export Configuration
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded"
          onClick={() => setScale(s => Math.min(s + 0.1, 2))}
        >
          Zoom In
        </button>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded"
          onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
        >
          Zoom Out
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        style={{
          width: 1080 * scale,
          height: 1080 * scale,
          border: '1px solid #ccc'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {selectedElement && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold">Selected Element: {selectedElement}</h3>
          {/* Add controls for selected element properties */}
        </div>
      )}
    </div>
  );
}; 