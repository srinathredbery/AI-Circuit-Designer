import React, { useEffect, useState } from 'react';

interface KiCanvasViewerProps {
  schContent?: string;
  src?: string;
}

export const KiCanvasViewer: React.FC<KiCanvasViewerProps> = ({ schContent, src }) => {
  const [key, setKey] = useState(0);
  const [internalContent, setInternalContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      if (src) {
        setLoading(true);
        console.log("KiCanvasViewer: Fetching from URL", src);
        try {
          const response = await fetch(src);
          const text = await response.text();
          setInternalContent(text);
          console.log("KiCanvasViewer: Fetched length", text.length);
        } catch (e) {
          console.error("KiCanvasViewer: Fetch failed", e);
        } finally {
          setLoading(false);
          setKey(prev => prev + 1);
        }
      } else if (schContent) {
        setInternalContent(schContent);
        setKey(prev => prev + 1);
      }
    };

    loadContent();
  }, [schContent, src]);

  const handleDownload = () => {
    const contentToDownload = internalContent || schContent || '';
    const blob = new Blob([contentToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schematic.kicad_sch';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-[#0f172a] rounded-xl border border-secondary/20 relative overflow-hidden flex flex-col">
      <div className="p-2 border-b border-secondary/20 bg-surface flex justify-between items-center text-secondary">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">KiCanvas (Backend Source)</span>
          {internalContent && <span className="text-[10px] text-secondary/50">({internalContent.length} bytes)</span>}
          {loading && <span className="text-[10px] text-primary animate-pulse ml-2">Loading...</span>}
        </div>
        <button 
           onClick={handleDownload}
           className="bg-primary/10 hover:bg-primary/20 text-primary text-xs px-3 py-1 rounded transition-colors border border-primary/20"
        >
          Download .kicad_sch
        </button>
      </div>
      <div className="flex-1 relative bg-[#0f172a]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 z-10 bg-[#0f172a]">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-secondary text-xs">Fetching schematic...</p>
          </div>
        ) : (internalContent || src) ? (
          <kicanvas-embed 
            key={key}
            src={src}
            theme="dark"
            className="w-full h-full"
            style={{ width: '100%', height: '100%', display: 'block' }}
            controls="true"
          >
            {!src && internalContent && (
              <kicanvas-source name="schematic.kicad_sch">
                {internalContent}
              </kicanvas-source>
            )}
          </kicanvas-embed>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary/50 text-sm italic">
            Waiting for schematic data...
          </div>
        )}
      </div>
    </div>
  );
};
