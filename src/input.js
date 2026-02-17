export class Input {
    constructor() {
        this.keysPressed = new Set();
        this.keysConsumed = new Set();

        document.addEventListener('keydown', (e) => {
            this.keysPressed.add(e.key);
        });

        document.addEventListener('keyup', (e) => {
            this.keysPressed.delete(e.key);
            this.keysConsumed.delete(e.key);
        });
    }

    isKeyPressed(key) {
        return this.keysPressed.has(key);
    }

    consumeKey(key) {
        this.keysConsumed.add(key);
    }

    isKeyConsumed(key) {
        return this.keysConsumed.has(key);
    }
}
