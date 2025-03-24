use num_complex;
use wasm_bindgen::prelude::*;

const MAX_IMAGE_SIZE: usize = 1000;

/*
	Rust only ever writes into this synchronously, typescript only ever reads from it. The worst case is the image
	 briefly looks weird. Therefore I decided to use unsafe code.

	How to do it safely: https://echo360.net.au/lesson/G_52dadb66-2fb2-430b-aa50-c5be14908a1b_2c2c30ed-fb2e-4c0a-b32d-ebf21641f91d_2025-03-05T14:00:00.000_2025-03-05T15:55:00.000/classroom
*/
const OUTPUT_BUFFER_SIZE: usize = MAX_IMAGE_SIZE * MAX_IMAGE_SIZE;
static mut OUTPUT_BUFFER: [[u8; 4]; OUTPUT_BUFFER_SIZE] =
	[[0,0,0,0]; OUTPUT_BUFFER_SIZE];

#[wasm_bindgen]
pub unsafe fn get_output_buffer_pointer() -> *const [u8; 4] {
	#[allow(static_mut_refs)] // WARN: errors are likely to come from here. If the assumptions above change be suspicious of this
	OUTPUT_BUFFER.as_ptr()
}

#[wasm_bindgen]
pub enum Fractal {
	Mandelbrot,
	Julia,
}

#[wasm_bindgen]
pub fn generate_fractal(
	left: f32, right: f32, top: f32, bottom: f32, // I would have made these structs to make things cleaner
	cursor_x: f32, cursor_y: f32, 	// But wasm_bindgen can't handle structs https://github.com/rustwasm/wasm-bindgen/issues/122
	width: u32, fractal: Fractal,
) {
	let size = std::cmp::min(MAX_IMAGE_SIZE, width as usize);

	for row in 0..size {
		for col in 0..size {
			// Translate from pixels to mathematical coordinates
			let x = (col as f32 / size as f32) * (right - left) + left;
			let y = (row as f32 / size as f32) * (bottom - top) + top;

			unsafe {
				OUTPUT_BUFFER[(row * size + col) as usize] = [
					0,
					match fractal {
						Fractal::Mandelbrot => mandelbrot_or_julia(0.0, 0.0, x, y),
						Fractal::Julia => mandelbrot_or_julia(x, y, cursor_x, cursor_y),
					},
					0,
					255,
				];
			}
		}
	}
}

fn mandelbrot_or_julia(zx: f32, zy: f32, cx: f32, cy: f32) -> u8 {
	let mut z = num_complex::Complex::new(zx, zy);
	let c = num_complex::Complex::new(cx, cy);
	let mut i: u8 = 0;

	// 255 seems like a reasonable number of iterations
	// It's the max value of a u8, so iterations map well onto green channel intensity,
	//  but if the user can zoom in it may not be enough to discern small changes
	// It'll do for now
	while i < 255 {
		// If it ever goes past 2 it will never converge
		// https://math.stackexchange.com/a/4082327
		if z.norm() > 2.0 {
			return 0;
		}

		z = z * z + c;
		i += 1;
	}

	i
}

// It's pretty slow :(