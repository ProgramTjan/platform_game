export class HUD {
    render(ctx, lives, score, level, isSecret = false, highScore = 0) {
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';

        // Schaduw voor leesbaarheid
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(5, 5, 130, 75);

        ctx.fillStyle = '#000000';
        ctx.fillText(`❤️  ${lives}`, 10, 22);
        ctx.fillText(`⭐ ${score}`, 10, 40);

        if (isSecret) {
            ctx.fillStyle = '#CC00CC';
            ctx.fillText(`🔮 Geheim!`, 10, 58);
        } else {
            ctx.fillStyle = '#000000';
            ctx.fillText(`📍 Level ${level}`, 10, 58);
        }

        ctx.fillStyle = '#886600';
        ctx.fillText(`🏆 ${highScore}`, 10, 76);
    }
}
