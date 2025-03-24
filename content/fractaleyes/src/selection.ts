import { draw_julia } from "./main.ts"

// initialise canvas
const canvas = document.getElementById("selection") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (!ctx) { throw new Error("Failed to get 2D context for map selection canvas"); }

ctx.setLineDash([10, 5]);
ctx.fillStyle = "#cb0332";
ctx.strokeStyle = "#0079ff";

// selection
let startX = 0;
let startY = 0;
let endX = canvas.width;
let endY = canvas.height;
// z value for julia set
let cursorX = canvas.width * 2.3 / 3;	// Initialise to (0,0)
let cursorY = canvas.height / 2;
// bounds of view
let left = -2.3;		// These defaults frame the Mandelbrot Set well
let right = 0.7;
let top = 1.5;
let bottom = -1.5;

// Draw initial value for julia set
ctx.beginPath();
ctx.arc(cursorX, cursorY, 4, 0, Math.PI * 2);
ctx.fill();


canvas.addEventListener("pointerdown",
	(e: PointerEvent) => {

		if (e.ctrlKey) {
			cursorX = e.offsetX;
			cursorY = e.offsetY;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.arc(cursorX, cursorY, 4, 0, Math.PI * 2);
			ctx.fill();
		}
		else {
			startX = e.offsetX;
			startY = e.offsetY;
		}
	});

canvas.addEventListener("pointermove",
	(e: PointerEvent) => {
		if (e.pressure == 0) return;		// https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (e.ctrlKey) {
			cursorX = e.offsetX;
			cursorY = e.offsetY;
			ctx.beginPath();
			ctx.arc(cursorX, cursorY, 4, 0, Math.PI * 2);
			ctx.fill();
		}
		else {
			// Constrain selection to be a square
			if (Math.abs(startX - e.offsetX) > Math.abs(startY - e.offsetY)) {
				endX = e.offsetX;
				endY = startY + Math.abs(startX - e.offsetX) * Math.sign(e.offsetY - startY);
			}
			else {
				endX = startX + Math.abs(startY - e.offsetY) * Math.sign(e.offsetX - startX);
				endY = e.offsetY;
			}

			ctx.strokeRect(startX, startY, endX - startX, endY - startY);
		}
	});


canvas.addEventListener("pointerup", (e: PointerEvent) => {
	if (e.ctrlKey) {
		draw_julia();
	}
	else {
		// click/tap to clear selection
		if (Math.sqrt((e.offsetX - startX) ** 2 + (e.offsetY - startY) ** 2) < 10) {
			startX = startY = endX = endY = 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}
});



export function getBounds() {
	console.log([left, right, top, bottom]);
	return [left, right, top, bottom];
}

export function getCursor() {
	console.log([(cursorX / canvas.width) * (right - left) + left, (cursorY / canvas.height) * (bottom - top) + top]);
	return [(cursorX / canvas.width) * (right - left) + left, (cursorY / canvas.height) * (bottom - top) + top];
}

export function zoom_selection() {
	// calculate new bounds
	let tmp_left = Math.min(startX, endX) / canvas.width * (right - left) + left;
	let tmp_right = Math.max(startX, endX) / canvas.width * (right - left) + left;
	let tmp_top = Math.min(startY, endY) / canvas.height * (bottom - top) + top;
	let tmp_bottom = Math.max(startY, endY) / canvas.height * (bottom - top) + top;
	left = tmp_left;
	right = tmp_right;
	top = tmp_top;
	bottom = tmp_bottom;
	// reset selection
	startX = startY = 0;
	endX = endY = canvas.width;
	ctx?.clearRect(0, 0, canvas.width, canvas.height);
}

export function reset_view() {
	left = -2.3;
	right = 0.7;
	top = 1.5;
	bottom = -1.5;
	startX = startY = endX = endY = 0;
}