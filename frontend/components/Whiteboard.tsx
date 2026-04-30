'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize2, Pencil, Type, Eraser, MousePointer2, Trash2, Download, Undo } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface Stroke {
  path: { x: number, y: number }[];
  color: string;
  width: number;
  tool: string;
}

export const Whiteboard = ({ call }: { call?: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0ea5e9');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  
  const currentPath = useRef<{ x: number, y: number }[]>([]);
  const [history, setHistory] = useState<Stroke[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        redrawFromHistory();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (call) {
      const unsubscribe = call.on('custom', (event: any) => {
        if (event.custom.type === 'whiteboard-draw') {
          const newStroke = event.custom.payload;
          setHistory(prev => [...prev, newStroke]);
          drawPath(newStroke.path, newStroke.color, newStroke.width, newStroke.tool);
        } else if (event.custom.type === 'whiteboard-clear') {
          clearLocalCanvas();
          setHistory([]);
        } else if (event.custom.type === 'whiteboard-undo') {
          setHistory(prev => {
            const next = prev.slice(0, -1);
            clearLocalCanvas();
            // We need to redraw from the new history
            // Since setState is async, we'll use a timeout or a separate function
            return next;
          });
        }
      });
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        unsubscribe();
      };
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [call]);

  // Redraw when history changes (especially for Undo)
  useEffect(() => {
    redrawFromHistory();
  }, [history]);

  const redrawFromHistory = () => {
    clearLocalCanvas();
    history.forEach(stroke => {
      drawPath(stroke.path, stroke.color, stroke.width, stroke.tool);
    });
  };

  const drawPath = (path: { x: number, y: number }[], pColor: string, pWidth: number, pTool: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || path.length < 2) return;

    ctx.beginPath();
    ctx.lineWidth = pTool === 'eraser' ? 20 : pWidth;
    ctx.strokeStyle = pTool === 'eraser' ? '#ffffff' : pColor;
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    currentPath.current = [];
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath.current.length > 1) {
      const newStroke: Stroke = {
        path: currentPath.current,
        color,
        width: lineWidth,
        tool
      };
      
      setHistory(prev => [...prev, newStroke]);

      if (call) {
        call.sendCustomEvent({
          type: 'whiteboard-draw',
          payload: newStroke
        });
      }
    }
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    currentPath.current.push({ x, y });

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearLocalCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClear = () => {
    clearLocalCanvas();
    setHistory([]);
    if (call) {
      call.sendCustomEvent({ type: 'whiteboard-clear', payload: {} });
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setHistory(prev => prev.slice(0, -1));
    if (call) {
      call.sendCustomEvent({ type: 'whiteboard-undo', payload: {} });
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'whiteboard-export.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="relative size-full bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col group/board">
      {/* Tool Palette */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-10 scale-90 md:scale-100 origin-top-left transition-transform duration-300">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col gap-2 shadow-2xl">
          <ToolButton 
            active={tool === 'pencil'} 
            onClick={() => setTool('pencil')} 
            icon={Pencil} 
            color={color}
          />
          <ToolButton 
            active={tool === 'eraser'} 
            onClick={() => setTool('eraser')} 
            icon={Eraser} 
          />
          <div className="h-px bg-white/10 mx-1" />
          <button 
            onClick={handleClear}
            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col gap-3 shadow-2xl">
          {['#0ea5e9', '#f59e0b', '#ef4444', '#10b981', '#6366f1', '#000000'].map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('pencil'); }}
              className={cn(
                "h-6 w-6 rounded-full transition-all border-2",
                color === c && tool === 'pencil' ? "border-white scale-125" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <Button 
          onClick={handleUndo}
          variant="outline" size="icon" className="bg-white/80 backdrop-blur-md border-slate-200 rounded-full hover:bg-white shadow-lg disabled:opacity-50"
          disabled={history.length === 0}
        >
          <Undo size={16} className="text-slate-600" />
        </Button>
        <Button 
          onClick={handleDownload}
          variant="outline" size="icon" className="bg-white/80 backdrop-blur-md border-slate-200 rounded-full hover:bg-white shadow-lg"
        >
          <Download size={16} className="text-slate-600" />
        </Button>
        <Button variant="outline" size="icon" className="bg-sky/10 backdrop-blur-md border-sky/20 rounded-full hover:bg-sky/20 shadow-lg">
          <Maximize2 size={16} className="text-sky" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="block"
        />
        
        {/* Placeholder if empty */}
        {history.length === 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        )}
      </div>
      
      {/* Bottom Status */}
      <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Whiteboard
          </span>
          <div className="h-3 w-px bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {tool === 'pencil' ? `Brush: ${lineWidth}px` : 'Eraser Mode'}
          </span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-sky" />
             <span className="text-[10px] font-bold text-sky uppercase tracking-[0.2em]">Sync: {history.length} strokes</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({ active, onClick, icon: Icon, color }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "h-10 w-10 flex items-center justify-center rounded-xl transition-all relative",
      active ? "bg-sky text-white shadow-lg shadow-sky/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon size={18} />
    {color && active && (
      <div 
        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
        style={{ backgroundColor: color }}
      />
    )}
  </button>
);
