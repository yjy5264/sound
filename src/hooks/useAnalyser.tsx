import * as React from "react";

export default function useAnalyser() {
	const audioCtx = React.useRef<AudioContext>();
	const analyser = React.useRef<AnalyserNode>();

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
		analyser.current.fftSize = 2048;
		const bufferLength = analyser.current.frequencyBinCount;
		let dataArray = new Uint8Array(bufferLength);
		analyser.current.getByteTimeDomainData(dataArray);

		const canvas = document.getElementById("oscilloscope") as HTMLCanvasElement
		if (!canvas) return;
		var canvasCtx = canvas.getContext("2d");
		if (!canvasCtx) return;

		canvasCtx.fillStyle = 'rgb(200, 200, 200)';
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

		canvasCtx.beginPath();

		var sliceWidth = canvas.width * 1.0 / bufferLength;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {

			var v = dataArray[i] / 128.0;
			var y = v * canvas.height / 2;

			if (i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height / 2);
		canvasCtx.stroke();
	}

	const draw2 = () => {
		if (!analyser.current) return;
		analyser.current.fftSize = 256;
		const bufferLength = analyser.current.frequencyBinCount;
		let dataArray = new Uint8Array(bufferLength);
		analyser.current.getByteTimeDomainData(dataArray);

		const canvas = document.getElementById("oscilloscope") as HTMLCanvasElement
		if (!canvas) return;
		var canvasCtx = canvas.getContext("2d");
		if (!canvasCtx) return;

		canvasCtx.fillStyle = 'rgb(200, 200, 200)';
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		var barWidth = (canvas.width / bufferLength) * 2.5;
		var barHeight;
		var x = 0;
		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray[i] / 2;

			canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
			canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);

			x += barWidth + 1;
		}
	}

	return draw;
}



