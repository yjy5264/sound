import * as React from "react";

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
		var canvasCtx = canvas.getContext("2d");
		if (!canvasCtx) return;

		canvasCtx.fillStyle = 'rgb(200, 200, 200)';
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

		const _bufferLength = bufferLength / 6;

		var barWidth = (canvas.width / _bufferLength) * 2.5;
		var barHeight;
		var x = 0;

		let max = 0;
		let index = 0;

		for(var i = 0; i < _bufferLength; i++) {
		    barHeight = dataArray[i];

			if (max < barHeight) {
				max = barHeight;
				index = i;
			}
		
		    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
		    canvasCtx.fillRect(x,canvas.height-barHeight/2,barWidth,barHeight/2);
	  
		    x += barWidth + 1;

		}

		setHz(index / bufferLength * MaxHz)
	}

	return [draw, hz];
}



