import * as React from "react";
import { getColor } from "../utils";

const MaxHz = 40500;

export default function useAnalyser(): [() => void, number] {
	const audioCtx = React.useRef<AudioContext>();
	const analyser = React.useRef<AnalyserNode>();
	const [hz, setHz] = React.useState(0);

	const init = () => {
		if (!navigator.mediaDevices) return;
		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
			audioCtx.current = new window.AudioContext();
			const source = audioCtx.current.createMediaStreamSource(stream)
			analyser.current = audioCtx.current.createAnalyser();
			source.connect(analyser.current);
		})
	}

	React.useEffect(() => {
		init();
	}, [])

	const draw = () => {
		if (!analyser.current) return;
		analyser.current.fftSize = 32768;
		const bufferLength = analyser.current.frequencyBinCount;
		let dataArray = new Uint8Array(bufferLength);
		analyser.current.getByteFrequencyData(dataArray);

		const canvas = document.getElementById("oscilloscope") as HTMLCanvasElement
		if (!canvas) return;
		const canvasCtx = canvas.getContext("2d");
		if (!canvasCtx) return;

		canvasCtx.fillStyle = 'rgb(200, 200, 200)';
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		const line = 4000
		const denominator = 40;

		const _bufferLength = bufferLength / denominator;

		const barWidth = (canvas.width / _bufferLength);

		let max = 0;
		let index = 0;

		for (let i = 0; i < _bufferLength; i++) {
		    const barHeight = canvas.height * dataArray[i] / 255;

			if (max < barHeight) {
				max = barHeight;
				index = i;
			}
		
		    canvasCtx.fillStyle = getColor(dataArray[i]);
		    canvasCtx.fillRect(barWidth * i, canvas.height - barHeight, barWidth, barHeight);
		}

		const currentLine = line / denominator;
		for (let i = currentLine; i < (MaxHz / denominator); i += currentLine) {
			const x = i / (MaxHz / denominator) * canvas.width;
			canvasCtx.font="30px Arial";
			canvasCtx.fillText(`${i}hz`, x - 100, 50);
			canvasCtx.fillRect(x, 0, 1, canvas.height);
		}

		setHz(index / bufferLength * MaxHz)
	}

	return [draw, hz];
}



