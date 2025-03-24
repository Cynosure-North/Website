import init, { generate_fractal, Fractal } from "./fracing.js"
import { getBounds, getCursor, reset_view, zoom_selection } from "./selection.ts"

//initialise wasm
const rustWasm = await init();
// Get a ts representation of the wasm memory
const wasmByteMemoryArray = new Uint8Array(rustWasm.memory.buffer);
const outputPointer = rustWasm.get_output_buffer_pointer();

// Initialise canvases. The canvas API is very confusing, thanks copilot.
const map = document.getElementById("map") as HTMLCanvasElement;
// const mapContext = map.getContext("2d", { alpha: false });
const mapContext = map.getContext("2d");
if (!mapContext) { throw new Error("Failed to get 2D context for map canvas"); }
const mapImageData = mapContext.createImageData(
	map.width,
	map.width
);

const result = document.getElementById("result") as HTMLCanvasElement;
const resultContext = result.getContext("2d", { alpha: false });
if (!resultContext) { throw new Error("Failed to get 2D context for result canvas"); }
const resultCanvasImageData = resultContext.createImageData(
	result.width,
	result.height
);

function draw_mandelbrot() {
	let [left, right, top, bottom] = getBounds();
	generate_fractal(left, right, top, bottom, 0, 0, map.width, Fractal.Mandelbrot);		 // Rust is so cool, I feel like a real programmer

	// Read the memory and draw it to the canvas
	const mapData = wasmByteMemoryArray.slice(
		outputPointer,
		outputPointer + map.width * map.height * 4
	);
	mapImageData.data.set(mapData);
	mapContext?.putImageData(mapImageData, 0, 0);
}

export function draw_julia() {
	let [cursorX, cursorY] = getCursor();
	generate_fractal(-2, 2, -2, 2, cursorX, cursorY, result.width, Fractal.Julia);

	// Read the memory and draw it to the canvas
	const resultImageDataArray = wasmByteMemoryArray.slice(
		outputPointer,
		outputPointer + result.width * result.height * 4
	);
	resultCanvasImageData.data.set(resultImageDataArray);
	resultContext?.putImageData(resultCanvasImageData, 0, 0);
}

document.getElementById("zoom")?.addEventListener("click", () => {
	zoom_selection();
	draw_mandelbrot();
});

document.getElementById("reset")?.addEventListener("click", () => {
	reset_view();
	draw_mandelbrot();
});

document.getElementById("save_mandelbrot")?.addEventListener("click", () => {
	let image = map.toDataURL("image/png").replace("image/png", "image/octet-stream");
	window.location.href = image;
});
document.getElementById("save_julia")?.addEventListener("click", () => {
	let image = result.toDataURL("image/png").replace("image/png", "image/octet-stream");
	window.location.href = image;
});


draw_mandelbrot();
draw_julia();


// Interesting videos
// https://www.youtube.com/watch?v=X-_LkF9V8AM
// https://www.youtube.com/watch?v=dSA7OZHdaoA