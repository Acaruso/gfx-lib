"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gfx = void 0;
const text_constants_1 = require("./text_constants");
class Gfx {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.queue = [];
        this.group = this.makeGroup();
        this.grouping = false;
        this.zOffset = 0;
    }
    push(command, z) {
        if (this.grouping === true) {
            this.group.queue.push({
                command,
                z
            });
        }
        else if (this.grouping === false) {
            this.queue.push({
                command,
                z: z + this.zOffset
            });
        }
    }
    beginGroup(z = 0) {
        this.grouping = true;
        this.group.z = z;
    }
    endGroup() {
        this.grouping = false;
        this.group.z += this.zOffset;
        this.queue.push(this.group);
        this.group = this.makeGroup();
    }
    makeGroup(z = 0) {
        return {
            type: "group",
            queue: [],
            z,
        };
    }
    drawRect(rect, z = 0) {
        const command = (ctx) => {
            const color = rect.color ? rect.color : "#000000";
            // 0.0 == transparent, 1.0 == solid
            const alpha = rect.alpha ? rect.alpha : 1.0;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.rect(rect.x, rect.y, rect.w, rect.h);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1.0;
        };
        this.push(command, z);
    }
    strokeRect(rect, z = 0, color = "#000000") {
        const upperLeft = { x: rect.x, y: rect.y };
        const upperRight = { x: rect.x + rect.w, y: rect.y };
        const lowerRight = { x: rect.x + rect.w, y: rect.y + rect.h };
        const lowerLeft = { x: rect.x, y: rect.y + rect.h };
        this.drawLine(upperLeft, upperRight, z, color);
        this.drawLine(upperRight, lowerRight, z, color);
        this.drawLine(lowerRight, lowerLeft, z, color);
        this.drawLine(lowerLeft, upperLeft, z, color);
    }
    drawLine(beginCoord, endCoord, z = 0, color = "#000000") {
        const command = (ctx) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(beginCoord.x, beginCoord.y);
            ctx.lineTo(endCoord.x, endCoord.y);
            ctx.stroke();
        };
        this.push(command, z);
    }
    strokeRectHeavy(rect, z = 0, color = "#000000") {
        this.drawLineHeavy({ x: rect.x, y: rect.y }, { x: rect.x + rect.w + 1, y: rect.y }, z, color);
        this.drawLineHeavy({ x: rect.x + rect.w, y: rect.y }, { x: rect.x + rect.w, y: rect.y + rect.h + 1 }, z, color);
        this.drawLineHeavy({ x: rect.x + rect.w, y: rect.y + rect.h }, { x: rect.x - 1, y: rect.y + rect.h }, z, color);
        this.drawLineHeavy({ x: rect.x, y: rect.y + rect.h }, { x: rect.x, y: rect.y - 1 }, z, color);
    }
    drawLineHeavy(beginCoord, endCoord, z = 0, color = "#000000") {
        const command = (ctx) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(beginCoord.x, beginCoord.y);
            ctx.lineTo(endCoord.x, endCoord.y);
            ctx.stroke();
        };
        this.push(command, z);
    }
    drawFilledCircle(coord, radius, z = 0, color = "#000000") {
        const command = (ctx) => {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(coord.x, coord.y, radius, 0, 2 * Math.PI);
            ctx.fill();
        };
        this.push(command, z);
    }
    drawText(text, size, coord, z = 0) {
        const command = (ctx) => {
            ctx.font = `${size}px ${text_constants_1.textConstants.textStyle}`;
            ctx.fillStyle = "#000000";
            // coord for fillText(text, coord) is *bottom* left side of text
            // however, our coord is for *top* left side of text
            // thus, we need to do coord.y + textConstants.charHeight
            ctx.fillText(text, coord.x, coord.y + text_constants_1.textConstants.charHeight);
        };
        this.push(command, z);
    }
    beginClipRect(rect, z = 0) {
        const command = (ctx) => {
            ctx.save();
            let path = new Path2D();
            path.rect(rect.x - 1, rect.y - 1, rect.w + 2, rect.h + 2);
            ctx.clip(path);
        };
        this.push(command, z);
    }
    endClip(z = 0) {
        const command = (ctx) => {
            ctx.restore();
        };
        this.push(command, z);
    }
    draw() {
        this.sortQueue(this.queue);
        let newQueue = [];
        for (const elt of this.queue) {
            if (elt.type && elt.type === "group") {
                this.sortQueue(elt.queue);
                for (const groupElt of elt.queue) {
                    newQueue.push(groupElt);
                }
            }
            else {
                newQueue.push(elt);
            }
        }
        this.queue = [];
        while (newQueue.length > 0) {
            const elt = newQueue[newQueue.length - 1];
            elt.command(this.ctx);
            newQueue.pop();
        }
    }
    sortQueue(queue) {
        queue.sort((first, second) => {
            return second.z - first.z;
        });
    }
    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
exports.Gfx = Gfx;
//# sourceMappingURL=Gfx.js.map