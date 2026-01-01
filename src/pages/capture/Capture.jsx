import React, { useEffect, useRef, useState } from 'react'
import { stateContext } from '../../utils/context/stateContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Capture = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { screenshots, setScreenshots } = stateContext();
    const [photoToBeSent, setPhotoToBeSent] = useState([])
    const [display, setDisplay] = useState(null);
    const [running, setRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
    };

    const base64ToFile = (base64Data, filename) => {
        const arr = base64Data.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };


    const takeScreenshot = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const img = canvas.toDataURL("image/png");
        setScreenshots((prev) => [...prev, img]);
        const file = base64ToFile(img, `screenshot_${Date.now()}.png`);
        setPhotoToBeSent((prev) => [...prev, file]);
    };

    const wait = (ms) => new Promise((res) => setTimeout(res, ms));

    const startSequence = async () => {
        if (running) return;

        setRunning(true);
        setScreenshots([]);

        for (let i = 0; i < 3; i++) {
            // Countdown
            setDisplay(3);
            await wait(1000);
            setDisplay(2);
            await wait(1000);
            setDisplay(1);
            await wait(1000);

            // Smile before photo
            setDisplay("😊 Smile!");
            await wait(600);

            takeScreenshot();
            await wait(400);
        }

        setDisplay(null);
        setRunning(false);
    };

    useEffect(() => {
        startCamera();
    }, [])


    const sendImages = async () => {
        setIsLoading(true);
        try {
            const formdata = new FormData();
            photoToBeSent.forEach((image) => {
                formdata.append(`images`, image);
            });

            // Send to backend
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/api/media/images`,
                formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
            );

            if (response.status === 201) {
                navigate("/customize");
            } else {
                console.log("error");
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };



    return (
        <div className='bg-[#e3e3e3] min-h-screen'>
            <div className='text-2xl font-bold text-[#000000] text-center pt-5 uppercase'>
                Capture Image
            </div>
            <div className="relative h-1/2 mt-10 mx-10 flex justify-center items-center">
                <video ref={videoRef} autoPlay playsInline className="h-full rotate-y-180 border rounded-2xl" />

                {display && (
                    <div className="absolute text-6xl font-bold text-white bg-black/70 px-6 py-4 rounded">
                        {display}
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-4 justify-center mt-4">
                {/* <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-black text-white rounded cursor-pointer"
                >
                    Start Camera
                </button> */}
                {
                    screenshots.length != 3 &&
                    <button
                        onClick={startSequence}
                        disabled={running}
                        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 cursor-pointer"
                    >
                        Click📸
                    </button>
                }
                {
                    screenshots.length == 3 &&
                    <div>
                        <button
                            onClick={startSequence}
                            disabled={running}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 cursor-pointer"
                        >
                            Restart
                        </button>
                        <button
                            onClick={() => {
                                sendImages();
                            }}
                            disabled={running || isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 cursor-pointer"
                        >
                            {
                                isLoading ? "Building your Amazing Photo Strip..." : 'Customize and Download'
                            }
                        </button>
                    </div>
                }
            </div>

            {/* <div className="grid grid-cols-3 gap-2 mt-6 px-4">
                {screenshots.map((img, i) => (
                    <img key={i} src={img} className="border" />
                ))}
            </div> */}

        </div>
    )
}

export default Capture
