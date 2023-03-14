module.exports = (ctx, img, x,y,w,h,rad) => {
    ctx.beginPath();
    ctx.arc(x+rad, y+rad, rad, Math.PI, Math.PI+Math.PI/2 , false);
    ctx.lineTo(x+w - rad, y);
    ctx.arc(x+w-rad, y+rad, rad, Math.PI+Math.PI/2, Math.PI*2 , false);
    ctx.lineTo(x+w,y+h - rad);
    ctx.arc(x+w-rad,y+h-rad,rad,Math.PI*2,Math.PI/2,false);
    ctx.lineTo(x+rad,y+h);
    ctx.arc(x+rad,y+h-rad,rad,Math.PI/2,Math.PI,false);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.drawImage(img,x,y,w,h);
    ctx.restore();
};