export class InputHandler {
    constructor() {
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            Space: false,
            Enter: false
        };

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.keys.Space = true;
            if (e.code === 'ArrowUp') this.keys.ArrowUp = true;
            if (e.code === 'ArrowDown') this.keys.ArrowDown = true;
            if (e.code === 'ArrowLeft') this.keys.ArrowLeft = true;
            if (e.code === 'ArrowRight') this.keys.ArrowRight = true;
            if (e.code === 'Enter') this.keys.Enter = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') this.keys.Space = false;
            if (e.code === 'ArrowUp') this.keys.ArrowUp = false;
            if (e.code === 'ArrowDown') this.keys.ArrowDown = false;
            if (e.code === 'ArrowLeft') this.keys.ArrowLeft = false;
            if (e.code === 'ArrowRight') this.keys.ArrowRight = false;
            if (e.code === 'Enter') this.keys.Enter = false;
        });
    }

    isDown(key) {
        return this.keys[key];
    }
}
