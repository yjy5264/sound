import * as React from "react";

export default function useGetSound(): [boolean, React.Dispatch<React.SetStateAction<boolean>>, BlobPart[]] {
    const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder>();
    const [chunks, setChunks] = React.useState<BlobPart[]>([])
    const [play, setPlay] = React.useState(false);

    const getUserAuthI = async () => {
        if (navigator.mediaDevices.getUserMedia) {
            const options = { audio: true };
            try {
                const stream = await navigator.mediaDevices.getUserMedia(options)
                return stream
            } catch (e) {
                console.error("授权失败");
                return null
            }
        } else {
            console.error("浏览器不支持,无法获取麦克风");
            return null
        }
    }

    const initStream = async () => {
        const _stream = await getUserAuthI();
        if (!_stream) return;
        const _mediaRecorder = new MediaRecorder(_stream);
        setMediaRecorder(_mediaRecorder);
    }

    React.useEffect(() => {
        initStream()
    }, [])

    React.useEffect(() => {
        if (!mediaRecorder) return
        mediaRecorder.ondataavailable = (e) => {
            const _chunks = [...chunks];
            _chunks.push(e.data)
            console.log(_chunks)
            setChunks(_chunks)
        }
        mediaRecorder.onstart = (e) => {
            console.log("onstart", e)
        }
        mediaRecorder.onerror = (e) => {
            console.log("onerror", e)
        }
    }, [mediaRecorder, chunks])

    const start = () => {
        if (!mediaRecorder) return
        console.log("start")
        mediaRecorder.start(100);
    }

    const end = () => {
        if (!mediaRecorder) return
        if (mediaRecorder.state !== "recording") return;
        console.log("end")
        mediaRecorder.stop();
    }
 
    React.useEffect(() => {
        if (play) start()
        else end()
    }, [play, mediaRecorder])

    return [play, setPlay, chunks];
}