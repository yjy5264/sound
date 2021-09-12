import * as React from "react";

export default function useGetSound():[boolean, React.Dispatch<React.SetStateAction<boolean>>] {
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

    const bindEvents = (target: MediaRecorder) => {
        target.addEventListener("dataavailable", (e) => {
            const _chunks = chunks.concat(e.data)
            console.log(_chunks)
            setChunks(_chunks)
        });

        target.addEventListener("stop", (e) => {
            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            setChunks([])
            // 转换成url
            const audioURL = window.URL.createObjectURL(blob);

            // 转换成文件
            const fileName = Date.now().toString(32);
            const fileType = "audio/ogg";
            const file = new window.File([blob], fileName, { type: fileType });

            // 下载
            const a = document.createElement("a");
            a.href = audioURL;
            a.download = fileName;
            a.click();
        })
    }

    const start = async () => {
        console.log("start")
        const stream = await getUserAuthI();
        if (!stream) return
        const mediaRecorder = new MediaRecorder(stream); // stream为获取权限时,取到的stream
        bindEvents(mediaRecorder);
    }
 
    React.useEffect(() => {
        if (play) start()
    }, [play])

    return [play, setPlay];
}