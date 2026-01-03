export const stripPatterns = {
  solid: (ctx, canvas, options = {}) => {
    fillBackground(ctx, canvas, options.bgColor);
  },

  stripes: (ctx, canvas, options = {}) => {
    fillBackground(ctx, canvas, options.bgColor);

    const stripeHeight = options.stripeHeight || 40;
    const colors = options.stripeColors || ["#222", "#333"];

    for (let y = 0; y < canvas.height; y += stripeHeight) {
      ctx.fillStyle = colors[(y / stripeHeight) % colors.length];
      ctx.fillRect(0, y, canvas.width, stripeHeight);
    }
  },

  patternImage: (ctx, canvas, options = {}) => {
    fillBackground(ctx, canvas, options.bgColor);

    if (!options.patternImg) return;

    const pattern = ctx.createPattern(options.patternImg, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
};


const fillBackground = (ctx, canvas, bgColor = "#fff") => {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
};
