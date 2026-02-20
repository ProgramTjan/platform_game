export class Renderer {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    clear() {
        // Enhanced sky gradient with warm horizon
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4A90D9');
        gradient.addColorStop(0.4, '#87CEEB');
        gradient.addColorStop(0.75, '#C8E6FF');
        gradient.addColorStop(1, '#FFECD2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawText(text, x, y, size = 16, color = '#000000', align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size}px Arial`;
        this.ctx.textAlign = align;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(text, x, y);
        this.ctx.shadowColor = 'transparent';
    }

    drawPauseMenu() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Text
        this.drawText('PAUSED', this.canvas.width / 2, this.canvas.height / 2, 36, '#FFFFFF', 'center');
        this.drawText('Press ESC to continue', this.canvas.width / 2, this.canvas.height / 2 + 30, 14, '#CCCCCC', 'center');
    }

    drawGameOver(score, highScore = 0) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Text
        this.drawText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30, 36, '#FF0000', 'center');
        this.drawText(`Score: ${score}`, this.canvas.width / 2, this.canvas.height / 2 + 10, 18, '#FFFFFF', 'center');
        this.drawText(`🏆 Best: ${highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 35, 16, '#FFD700', 'center');
        this.drawText('Press R to play again', this.canvas.width / 2, this.canvas.height / 2 + 60, 12, '#CCCCCC', 'center');
    }

    drawVictory(score, highScore = 0) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Text
        this.drawText('VICTORY!', this.canvas.width / 2, this.canvas.height / 2 - 30, 36, '#FFD700', 'center');
        this.drawText(`Score: ${score}`, this.canvas.width / 2, this.canvas.height / 2 + 10, 18, '#FFFFFF', 'center');
        this.drawText(`🏆 Best: ${highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 35, 16, '#FFD700', 'center');
        this.drawText('Press R to play again', this.canvas.width / 2, this.canvas.height / 2 + 60, 12, '#CCCCCC', 'center');
    }
}
