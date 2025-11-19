export class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Nokia palette
        this.colorDark = '#43523d';
        this.colorLight = '#C7F0D8';

        // Disable anti-aliasing
        this.ctx.imageSmoothingEnabled = false;
    }

    clear() {
        this.ctx.fillStyle = this.colorLight;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawPixel(x, y) {
        this.ctx.fillStyle = this.colorDark;
        this.ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    }

    drawRect(x, y, w, h) {
        this.ctx.fillStyle = this.colorDark;
        this.ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
    }

    // Sprite is a 2D array of 0s and 1s
    drawSprite(x, y, sprite) {
        this.ctx.fillStyle = this.colorDark;
        for (let r = 0; r < sprite.length; r++) {
            for (let c = 0; c < sprite[r].length; c++) {
                if (sprite[r][c] === 1) {
                    this.ctx.fillRect(Math.floor(x) + c, Math.floor(y) + r, 1, 1);
                }
            }
        }
    }

    drawText(text, x, y, size = 10) {
        this.ctx.fillStyle = this.colorDark;
        this.ctx.font = `${size}px 'VT323', monospace`;
        this.ctx.fillText(text, x, y);
    }
}
