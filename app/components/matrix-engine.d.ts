export {};
declare global {
  interface AIWORKMatrixState {
    supported: boolean;
    frame: number;
    time: number;
    paused: boolean;
    reducedMotion: boolean;
    hidden: boolean;
    width: number;
    height: number;
    dpr: number;
    quality: number;
    qualityTier: "lowest" | "reduced" | "full";
    gridCells: number;
    gridRevision: number;
    gridPixels: number;
    transform: {scale:number;x:number;y:number;width:number;height:number};
  }
  interface AIWORKMatrixHandle {
    pause(): void;
    resume(): void;
    destroy(): void;
    renderAt(seconds:number): void;
    getState(): AIWORKMatrixState | {supported:false};
  }
  interface Window {
    AIWORKMatrix: {
      mount(canvas: HTMLCanvasElement, options?: {posterElement?:HTMLImageElement;maxDpr?:number;mobileMaxDpr?:number;desktopFps?:number;mobileFps?:number;intensity?:number;onQualityChange?:(state:{quality:number;tier:"lowest"|"reduced"|"full"})=>void}): AIWORKMatrixHandle;
    };
  }
}
