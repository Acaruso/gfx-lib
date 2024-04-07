declare class Gfx {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    queue: Array<any>;
    group: any;
    grouping: boolean;
    zOffset: number;
    constructor(canvas: HTMLCanvasElement);
    push(command: any, z: number): void;
    beginGroup(z?: number): void;
    endGroup(): void;
    makeGroup(z?: number): {
        type: string;
        queue: never[];
        z: number;
    };
    drawRect(rect: any, z?: number): void;
    strokeRect(rect: any, z?: number, color?: string): void;
    drawLine(beginCoord: any, endCoord: any, z?: number, color?: string): void;
    strokeRectHeavy(rect: any, z?: number, color?: string): void;
    drawLineHeavy(beginCoord: any, endCoord: any, z?: number, color?: string): void;
    drawFilledCircle(coord: any, radius: number, z?: number, color?: string): void;
    drawText(text: string, size: number, coord: any, z?: number): void;
    beginClipRect(rect: any, z?: number): void;
    endClip(z?: number): void;
    draw(): void;
    sortQueue(queue: Array<any>): void;
    clearScreen(): void;
}
export { Gfx };
