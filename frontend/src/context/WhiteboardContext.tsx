import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Shape {
  id: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  text?: string;
  fontSize?: number;
  data?: any;
}

interface WhiteboardContextType {
  shapes: Shape[];
  addShapes: (shapes: Shape[]) => void;
  clearShapes: () => void;
  renderShapes: (shapes: Shape[]) => void;
}

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined);

export const useWhiteboard = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider');
  }
  return context;
};

interface WhiteboardProviderProps {
  children: ReactNode;
}

export const WhiteboardProvider: React.FC<WhiteboardProviderProps> = ({ children }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  const addShapes = useCallback((newShapes: Shape[]) => {
    setShapes(prev => [...prev, ...newShapes]);
  }, []);

  const clearShapes = useCallback(() => {
    setShapes([]);
  }, []);

  const renderShapes = useCallback((newShapes: Shape[]) => {
    setShapes(newShapes);
  }, []);

  const value: WhiteboardContextType = {
    shapes,
    addShapes,
    clearShapes,
    renderShapes
  };

  return (
    <WhiteboardContext.Provider value={value}>
      {children}
    </WhiteboardContext.Provider>
  );
};
