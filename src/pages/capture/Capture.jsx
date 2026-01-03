import React, { useEffect, useRef, useState } from 'react'
import { stateContext } from '../../utils/context/stateContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';
import CameraIcon from '../../assets/capture/cameraIcon.svg';
import UploadIcon from '../../assets/capture/uploadIcon.svg';
import Footer from '../../components/common/Footer';
import base64ToFile from '../../utils/Base64ToFile';

const Capture = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { screenshots, setScreenshots, photoToBeSent, setPhotoToBeSent, urls, seturls } = stateContext();
    const [display, setDisplay] = useState(null);
    const [running, setRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCamera, setshowCamera] = useState(false);


    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setshowCamera(true);
        // startSequence();
    };

    const stopCamera = async () => {
        if (!videoRef.current) return
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        for (let track of tracks) {
            track.stop();
        }
        setshowCamera(false);
    }

    // const base64ToFile = (base64Data, filename) => {
    //     const arr = base64Data.split(',');
    //     const mime = arr[0].match(/:(.*?);/)[1];
    //     const bstr = atob(arr[1]);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);
    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new File([u8arr], filename, { type: mime });
    // };


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

        if (videoRef?.current?.srcObject?.active == false) {
            startCamera();
        }

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
        stopCamera();
    };

    useEffect(() => {
        setScreenshots([]);
        seturls([]);
        setPhotoToBeSent([]);
        return () => stopCamera();
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
                setPhotoToBeSent([]);
                seturls(response.data.urls);
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
        <div className='bg-[#e3e3e3] flex flex-col justify-between h-screen min-h-screen'>
            <Navbar />
            <div className='flex flex-col h-[70%]'>

                <div className='text-2xl font-bold text-[#000000] text-center pt-5 uppercase'>
                    Capture/Upload Image
                </div>
                {
                    showCamera &&
                    <div className="relative h-1/2 mt-10 mx-10 flex justify-center items-center">
                        <video ref={videoRef} autoPlay playsInline className="h-full rotate-y-180 border rounded-2xl" />

                        {display && (
                            <div className="absolute text-2xl font-bold text-white bg-black/30 px-6 py-4 rounded">
                                {display}
                            </div>
                        )}
                    </div>

                }

                <canvas ref={canvasRef} className="hidden" />

                <div className="flex gap-4 justify-center mt-4">
                    {
                        screenshots.length != 3 && !showCamera &&
                        <div className='pt-10 flex items-center justify-between gap-10'>
                            <button
                                onClick={() => {
                                    startCamera()
                                    startCamera()
                                }}
                                disabled={running}
                                className="px-4 py-2 bg-[#248848] text-white rounded disabled:opacity-50 cursor-pointer flex items-center gap-1"
                            >
                                Capture
                                <span><img src={CameraIcon} alt="camera icon" className='w-5 h-5 min-w-5 min-h-5 object-contain shrink-0' /></span>
                            </button>
                        </div>
                    }
                    {
                        screenshots.length != 3 && showCamera &&
                        <div className='pt-10 flex items-center justify-between gap-10'>
                            <button
                                onClick={() => {
                                    startSequence();
                                }}
                                disabled={running}
                                className="px-7 py-2 bg-[#248848] text-white rounded disabled:opacity-50 cursor-pointer flex items-center gap-1"
                            >
                                Click
                                <span><img src={CameraIcon} alt="camera icon" className='w-5 h-5 min-w-5 min-h-5 object-contain shrink-0' /></span>
                            </button>
                        </div>
                    }
                    {
                        screenshots.length == 3 &&
                        <div className='flex flex-col items-center justify-center'>
                            <div className='flex overflow-x-scroll items-center gap-3' style={{ scrollbarWidth: 'thin' }}>
                                {
                                    screenshots.map((img, i) => (
                                        <img key={i} src={img} className="border w-52 m-3 rounded-lg" />
                                    ))
                                }
                            </div>
                            <div className='flex items-center justify-between gap-5 mt-7 w-full'>

                                <button
                                    onClick={() => {
                                        setScreenshots([]);
                                        startCamera();
                                        startCamera();
                                    }}
                                    disabled={running}
                                    className="px-8 py-2 w-1/2 bg-green-600 text-white rounded disabled:opacity-50 cursor-pointer"
                                >
                                    Restart
                                </button>
                                <button
                                    onClick={() => {
                                        sendImages();
                                    }}
                                    disabled={running || isLoading}
                                    className="px-4 py-2 w-1/2 bg-green-600 text-white rounded disabled:opacity-50 cursor-pointer"
                                >
                                    {
                                        isLoading ? "Building your Amazing Photo Strip..." : 'Customize and Download'
                                    }
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {/* <div className="grid grid-cols-3 gap-2 mt-6 px-4">
                {screenshots.map((img, i) => (
                    <img key={i} src={img} className="border" />
                ))}
            </div> */}

            <Footer />

        </div>
    )
}

export default Capture
