var photo = new Image(1980, 1980);
photo.src = "me.jpg"
var scale = 10;
let prev;

function init(){
	ctx = document.getElementsByTagName("Canvas")[0].getContext('2d', { alpha: false });

	resize();

	ctx.fillStyle = 'black';
	window.requestAnimationFrame(step);
}

function step(timestamp){

	if (prev === undefined)
		prev = timestamp;
	let elapsed = timestamp - prev;
	if (elapsed > 10){

		prev = timestamp;

		if (scale > 2.69*window.innerHeight){
			scale = 5;
		}
		scale += (2 + 0.000001*scale*scale)*(elapsed/60);

		ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

		ctx.save();		//Allows me to transform and rotate, and then restore the coordinates for next
		ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
		ctx.rotate(scale*Math.PI/180);
		ctx.drawImage(photo, -scale/2, -scale/2, scale, scale);	
		ctx.restore();
	}

	window.requestAnimationFrame(step);
}


function resize(){  
	ctx.canvas.style.width = window.innerWidth;
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.style.height = window.innerHeight
;	ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

/*
CSS:
canvas{
	position: absolute;
	top: 0;
	left: 0;
}


HTML:
<body onload="init()" onresize="resize()">
			<canvas id="canvas"></canvas>
</body>


*/