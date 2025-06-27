<script>
	import { onMount } from 'svelte';
	let video = $state(null);
	let canvas = $state(null);
	let ctx = $state(null);
	let vidStream = $state(null);

	function processImage() {
		// Get the image data
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const { data, width, height } = imageData;

		sobelFilter(ctx, width, height);

		return;

		// Convert the image to grayscale
		const gray = grayscale(data, width, height);

		// Apply Gaussian blur to the grayscale image
		const blurred = gaussianBlur(gray, width, height);

		// Calculate gradients
		const { gradients, angles } = gradient(blurred, width, height);

		// Apply Non-Maximum Suppression
		const nonMaxSuppressed = nonMaximumSuppression(gradients, angles, width, height);

		// Apply Double Threshold and Edge Tracking
		const edgeDetected = doubleThresholdAndEdgeTracking(
			nonMaxSuppressed,
			width,
			height,
			40,
			80
		);

		// Put the result back onto the canvas
		const outputData = ctx.createImageData(width, height);
		for (let i = 0; i < edgeDetected.length; i++) {
			const v = edgeDetected[i] ? 255 : 0;
			outputData.data[i * 4] = v;
			outputData.data[i * 4 + 1] = v;
			outputData.data[i * 4 + 2] = v;
			outputData.data[i * 4 + 3] = 255;
		}
		ctx.putImageData(outputData, 0, 0);
	}

	function grayscale(data, width, height) {
		const gray = new Float32Array(width * height);
		for (let i = 0; i < width * height; i++) {
			const r = data[i * 4];
			const g = data[i * 4 + 1];
			const b = data[i * 4 + 2];
			gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
		}
		return gray;
	}

	function gaussianBlur(gray, width, height) {
		// Use a simple 3x3 Gaussian kernel
		const kernel = [
			[1, 2, 1],
			[2, 4, 2],
			[1, 2, 1]
		];
		const kernelWeight = 16;
		return applyConvolution(gray, width, height, kernel, kernelWeight);
	}

	function gradient(gray, width, height) {
		const Sx = [
			[-1, 0, 1],
			[-2, 0, 2],
			[-1, 0, 1]
		];
		const Sy = [
			[-1, -2, -1],
			[0, 0, 0],
			[1, 2, 1]
		];
		const gradients = new Float32Array(width * height);
		const angles = new Float32Array(width * height);
		for (let y = 1; y < height - 1; y++) {
			for (let x = 1; x < width - 1; x++) {
				let gx = 0;
				let gy = 0;
				for (let ky = -1; ky <= 1; ky++) {
					for (let kx = -1; kx <= 1; kx++) {
						const pixel = gray[(y + ky) * width + (x + kx)];
						gx += pixel * Sx[ky + 1][kx + 1];
						gy += pixel * Sy[ky + 1][kx + 1];
					}
				}
				const magnitude = Math.sqrt(gx * gx + gy * gy);
				gradients[y * width + x] = magnitude;
				angles[y * width + x] = Math.atan2(gy, gx);
			}
		}
		return { gradients, angles };
	}

	function nonMaximumSuppression(gradients, angles, width, height) {
		const output = new Float32Array(width * height);
		const angleQuantization = Array.from(
			angles,
			(angle) => (angle * (180 / Math.PI) + 360) % 360
		);
		for (let y = 1; y < height - 1; y++) {
			for (let x = 1; x < width - 1; x++) {
				const pos = y * width + x;
				const angle = angleQuantization[pos];
				const magnitude = gradients[pos];
				let neighbour1, neighbour2;

				if ((angle >= 0 && angle < 45) || (angle >= 180 && angle < 225)) {
					neighbour1 = gradients[pos - 1];
					neighbour2 = gradients[pos + 1];
				} else if ((angle >= 45 && angle < 90) || (angle >= 225 && angle < 270)) {
					neighbour1 = gradients[pos - width - 1];
					neighbour2 = gradients[pos + width + 1];
				} else if ((angle >= 90 && angle < 135) || (angle >= 270 && angle < 315)) {
					neighbour1 = gradients[pos - width];
					neighbour2 = gradients[pos + width];
				} else {
					neighbour1 = gradients[pos - width + 1];
					neighbour2 = gradients[pos + width - 1];
				}

				if (magnitude >= neighbour1 && magnitude >= neighbour2) {
					output[pos] = magnitude;
				} else {
					output[pos] = 0;
				}
			}
		}
		return output;
	}

	function doubleThresholdAndEdgeTracking(data, width, height, lowThreshold, highThreshold) {
		const strongEdges = [];
		const weakEdges = [];
		const output = new Uint8ClampedArray(width * height);

		for (let i = 0; i < data.length; i++) {
			if (data[i] >= highThreshold) {
				strongEdges.push(i);
				output[i] = 1;
			} else if (data[i] >= lowThreshold) {
				weakEdges.push(i);
				output[i] = 0.5;
			}
		}

		function isConnectedToStrongEdge(x, y) {
			for (let ky = -1; ky <= 1; ky++) {
				for (let kx = -1; kx <= 1; kx++) {
					if (kx === 0 && ky === 0) continue;
					const ny = y + ky;
					const nx = x + kx;
					if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
						if (output[ny * width + nx] === 1) {
							return true;
						}
					}
				}
			}
			return false;
		}

		for (const edge of weakEdges) {
			const x = edge % width;
			const y = Math.floor(edge / width);
			if (isConnectedToStrongEdge(x, y)) {
				output[edge] = 1;
			} else {
				output[edge] = 0;
			}
		}
		return output;
	}

	function applyConvolution(input, width, height, kernel, kernelWeight) {
		const halfK = Math.floor(kernel.length / 2);
		const output = new Float32Array(width * height);
		for (let y = halfK; y < height - halfK; y++) {
			for (let x = halfK; x < width - halfK; x++) {
				let sum = 0;
				for (let ky = -halfK; ky <= halfK; ky++) {
					for (let kx = -halfK; kx <= halfK; kx++) {
						sum += input[(y + ky) * width + (x + kx)] * kernel[ky + halfK][kx + halfK];
					}
				}
				output[y * width + x] = sum / kernelWeight;
			}
		}
		return output;
	}

	const toGrayscale = (context, width, height) => {
		const imageData = context.getImageData(0, 0, width, height);
		const data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
			data[i] = data[i + 1] = data[i + 2] = gray;
		}
		context.putImageData(imageData, 0, 0);
	};

	const sobelFilter = (context, width, height, mag = 0.8) => {
		const imageData = context.getImageData(0, 0, width, height);
		const data = imageData.data;
		const outImageData = context.createImageData(width, height);
		const outData = outImageData.data;

		const gx = [
			[-1, 0, 1],
			[-2, 0, 2],
			[-1, 0, 1]
		];
		const gy = [
			[1, 2, 1],
			[0, 0, 0],
			[-1, -2, -1]
		];

		const getGrayAt = (x, y) => {
			const index = (y * width + x) * 4;
			return data[index]; // Assuming the data is already in grayscale
		};

		for (let y = 1; y < height - 1; y++) {
			for (let x = 1; x < width - 1; x++) {
				let sumX = 0;
				let sumY = 0;
				for (let dy = -1; dy <= 1; dy++) {
					for (let dx = -1; dx <= 1; dx++) {
						const weightX = gx[dy + 1][dx + 1];
						const weightY = gy[dy + 1][dx + 1];
						const gray = getGrayAt(x + dx, y + dy);
						sumX += gray * weightX;
						sumY += gray * weightY;
					}
				}
				const magnitude = Math.sqrt(sumX * sumX + sumY * sumY) * mag;
				const index = (y * width + x) * 4;
				outData[index] = outData[index + 1] = outData[index + 2] = magnitude;
				outData[index + 3] = 255; // Alpha channel
			}
		}
		context.putImageData(outImageData, 0, 0);
	};

	const fillRegionColor = (context, width, height, threshold) => {
		const imageData = context.getImageData(0, 0, width, height);
		const data = imageData.data;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = (y * width + x) * 4;
				if (data[index] > threshold) {
					// Let's color high magnitude areas
					data[index] = 0; // Red
					data[index + 1] = 0; // Green
					data[index + 2] = 255; // Blue
				} else {
					// Further adjust this logic for different regions
					data[index] = 255;
					data[index + 1] = 255;
					data[index + 2] = 255;
				}
			}
		}
		context.putImageData(imageData, 0, 0);
	};

	function processPixels() {
		console.log('processing pixels...');
		const imgD = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imgD.data;

		for (let i = 0; i < data.length; i += 4) {
			const red = data[i];
			const green = data[i + 1];
			const blue = data[i + 2];

			// Compute the grayscale value using luminance formula
			const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;

			// Set each channel to the grayscale value
			data[i] = grayscale; // Red
			data[i + 1] = grayscale; // Green
			data[i + 2] = grayscale; // Blue
			// Alpha (data[i + 3]) remains the same
		}

		// Put the updated image data back into the canvas
		ctx.putImageData(imgD, 0, 0);
	}

	function drawFrame() {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		processImage();
		trackPoint();
		requestAnimationFrame(drawFrame);
	}

	function trackPoint() {
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'red';
		ctx.strokeRect(20, 20, 10, 10);
	}

	onMount(() => {
		console.log('mounting.');
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');

		drawFrame();

		// Check for browser support
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			// Request video stream
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((stream) => {
					vidStream = stream;
					// Set the video source to the stream
					video.srcObject = stream;
				})
				.catch((error) => {
					console.error('Error accessing camera: ', error);
				});
		} else {
			console.error('getUserMedia is not supported by this browser');
		}
	});
</script>

<div>
	<canvas id="canvas" class="bg-red-300 absolute z-[999] w-full h-full" />
	<video id="video" width="240" height="480" autoplay class="hidden w-full h-full"></video>
</div>
