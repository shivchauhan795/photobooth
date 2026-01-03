import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { stateContext } from "../../utils/context/stateContext";
import { stripPatterns } from "../../utils/stripPatterns.js";
import HeartImage from '../../assets/customize/patterns/heart.svg'
import StarImage from '../../assets/customize/patterns/start.svg'
import Navbar from "../../components/common/Navbar.jsx";
import Footer from "../../components/common/Footer.jsx";
import base64ToFile from "../../utils/Base64ToFile.js";
import MoveToLogin from "../../components/popups/MoveToLogin.jsx";
import axios from "axios";
import { AuthToken } from "../../utils/AuthToken.js";
import toast, { Toaster } from "react-hot-toast";

const Customize = () => {
    const navigate = useNavigate();
    const stripCanvasRef = useRef(null);
    const patternImgRef = useRef(null);

    const { screenshots, setScreenshots, setPhotoToBeSent, photoToBeSent, seturls, urls } = stateContext();

    const [pattern, setPattern] = useState("solid");
    const [stripConfig, setstripConfig] = useState({
        photoWidth: 360,
        photoHeight: 260,
        padding: 20,
        headerHeight: 80,
        borderSize: 4,
        borderColor: "#000000",
        bgColor: "#ffffff",
    });

    const [imageForPattern, setImageForPattern] = useState(HeartImage)
    const [showMoveToLogin, setShowMoveToLogin] = useState(false)
    const [donewithdownload, setdonewithdownload] = useState(false);

    // const stripConfig = {
    //     photoWidth: 360,
    //     photoHeight: 260,
    //     padding: 20,
    //     headerHeight: 80,
    //     borderSize: 6,
    //     borderColor: "#fff",
    //     bgColor: "#fff",
    // };

    // load pattern image (icons, hearts, etc.)
    useEffect(() => {
        const img = new Image();
        img.src = imageForPattern; // optional
        img.onload = () => {
            patternImgRef.current = img;
            createPhotoStrip();
        };
    }, [imageForPattern]);

    const createPhotoStrip = async () => {
        if (!screenshots || screenshots.length === 0) return;

        const images = await Promise.all(
            screenshots.map(
                (src) =>
                    new Promise((resolve) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => resolve(img);
                    })
            )
        );

        const canvas = stripCanvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width =
            stripConfig.photoWidth + stripConfig.padding * 2;

        canvas.height =
            images.length * stripConfig.photoHeight +
            stripConfig.padding * (images.length + 1) +
            stripConfig.headerHeight;

        // 🔹 background / pattern
        stripPatterns[pattern](ctx, canvas, {
            bgColor: stripConfig.bgColor,
            patternImg: patternImgRef.current,
        });

        // 🔹 header
        // if (stripConfig.headerHeight > 0) {
        //     ctx.fillStyle = "#fff";
        //     ctx.font = "bold 30px Arial";
        //     ctx.textAlign = "center";
        //     ctx.fillText(
        //         "PhotoBooth",
        //         canvas.width / 2,
        //         stripConfig.headerHeight / 1.5
        //     );
        // }

        // 🔹 photos
        images.forEach((img, i) => {
            const y =
                stripConfig.padding +
                i *
                (stripConfig.photoHeight +
                    stripConfig.padding);

            // border
            ctx.fillStyle = stripConfig.borderColor;
            ctx.fillRect(
                stripConfig.padding - stripConfig.borderSize,
                y - stripConfig.borderSize,
                stripConfig.photoWidth +
                stripConfig.borderSize * 2,
                stripConfig.photoHeight +
                stripConfig.borderSize * 2
            );

            ctx.drawImage(
                img,
                stripConfig.padding,
                y,
                stripConfig.photoWidth,
                stripConfig.photoHeight
            );
        });
    };

    useEffect(() => {
        if (screenshots.length === 3) {
            createPhotoStrip();
        } else {
            navigate("/");
        }
    }, [screenshots, pattern, stripConfig]);
    useEffect(() => {
        if (donewithdownload) {
            setTimeout(() => {
                navigate('/');
            }, 2000)
        }
    }, [donewithdownload])

    const downloadStrip = async () => {
        const link = document.createElement("a");
        link.download = "photobooth-strip.png";
        link.href =
            stripCanvasRef.current.toDataURL("image/png");
        const file = base64ToFile(link.href, `strip_${Date.now()}.png`)
        setPhotoToBeSent((prev) => [...prev, file]);
        link.click()
        const newUrls = await sendImages([file]);
        if (AuthToken() == null) {
            // setScreenshots([]);
            setShowMoveToLogin(true)
        } else {
            await handleSaveImageToAccount(newUrls);
            setdonewithdownload(true);
        }
    };

    const handleSaveImageToAccount = async (newUrls) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/api/media/images/inaccount`, {
                urls: newUrls
            }, {
                headers: {
                    Authorization: `Token ${AuthToken()}`
                }
            })
            if (response.status == 201) {
                toast.success('Images saved successfully to your account!!');
                setScreenshots([]);
                seturls([]);
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error(e.response.data.message);
        }
    }


    const sendImages = async (imagesToBeSent) => {
        try {
            const formdata = new FormData();
            imagesToBeSent.forEach((image) => {
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
                const newUrls = [...urls, ...response.data.urls];
                setPhotoToBeSent([]);
                seturls([...urls, ...response.data.urls]);
                return newUrls;

            } else {
                console.log("error");
            }
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className="h-screen flex flex-col justify-between w-full">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex flex-col h-[90%]">

                <Navbar />
                <div className="flex max-sm:flex-col mt-10 gap-10 h-[80%]">

                    <div className="flex flex-col items-center overflow-hidden w-1/2 max-sm:w-full py-2">

                        <canvas
                            ref={stripCanvasRef}
                            className="border mb-4 h-full"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-10 w-1/2 max-sm:w-full">

                        <div className="mb-4 flex gap-3">
                            <button
                                onClick={() => setPattern("solid")}
                                className={`px-3 py-1 border rounded cursor-pointer ${pattern == "solid" ? "bg-[#248848] text-white" : ""}`}
                            >
                                Solid
                            </button>
                            {/* <button
                                onClick={() => setPattern("stripes")}
                                className="px-3 py-1 border rounded"
                            >
                                Stripes
                            </button> */}
                            <button
                                onClick={() => setPattern("patternImage")}
                                className={`px-3 py-1 border rounded cursor-pointer ${pattern == "patternImage" ? "bg-[#248848] text-white" : ""}`}
                            >
                                Pattern Image
                            </button>
                        </div>
                        {
                            pattern == 'solid' &&
                            <div>
                                <div>
                                    <label htmlFor="bgcolor">Background Color:</label>
                                    <input type="color" id="bgcolor" name="bgcolor" value={stripConfig.bgColor} onChange={(e) => {
                                        setstripConfig(prev => ({
                                            ...prev,
                                            bgColor: e.target.value
                                        }));
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="bordercolor">Border Color:</label>
                                    <input type="color" id="bordercolor" name="bordercolor" value={stripConfig.borderColor} onChange={(e) => {
                                        setstripConfig(prev => ({
                                            ...prev,
                                            borderColor: e.target.value
                                        }));
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="bordersize">Border Width:</label>
                                    <input type="range" id="bordersize" name="bordersize" value={stripConfig.borderSize} onChange={(e) => {
                                        setstripConfig(prev => ({
                                            ...prev,
                                            borderSize: e.target.value
                                        }));
                                    }} />
                                </div>
                            </div>
                        }
                        {
                            pattern == 'patternImage' &&
                            <div>
                                <div>
                                    <label htmlFor="bgcolor">Background Color:</label>
                                    <input type="color" id="bgcolor" name="bgcolor" value={stripConfig.bgColor} onChange={(e) => {
                                        setstripConfig(prev => ({
                                            ...prev,
                                            bgColor: e.target.value
                                        }));
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="bordercolor">Border Color:</label>
                                    <input type="color" id="bordercolor" name="bordercolor" value={stripConfig.borderColor} onChange={(e) => {
                                        setstripConfig(prev => ({
                                            ...prev,
                                            borderColor: e.target.value
                                        }));
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="bordersize">Border Width:</label>
                                    <input type="range" id="bordersize" name="bordersize" value={stripConfig.borderSize} onChange={(e) => {
                                        setstripConfig(prev => ({
                                            ...prev,
                                            borderSize: e.target.value
                                        }));
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="pattern">Pattern:</label>
                                    <div className="flex items-center gap-2">
                                        <div onClick={() => setImageForPattern(HeartImage)} className={`border p-1 w-fit h-fit rounded-md cursor-pointer ${imageForPattern == HeartImage ? "bg-[#248848] text-white" : ""}`}><img src={HeartImage} alt="" className="w-5 h-5 min-w-5 min-h-5 object-contain shrink-0" /></div>
                                        <div onClick={() => setImageForPattern(StarImage)} className={`border p-1 w-fit h-fit rounded-md cursor-pointer ${imageForPattern == StarImage ? "bg-[#248848] text-white" : ""}`}><img src={StarImage} alt="" className="w-5 h-5 min-w-5 min-h-5 object-contain shrink-0" /></div>
                                    </div>
                                </div>

                            </div>
                        }



                        <button
                            onClick={downloadStrip}
                            className="px-4 py-2 bg-[#248848] text-white rounded cursor-pointer"
                        >
                            Download Strip 📥
                        </button>
                    </div>

                </div>
            </div>
            <Footer />
            {
                showMoveToLogin &&
                <MoveToLogin onClose={() => setShowMoveToLogin(false)} />
            }
        </div>
    );
};

export default Customize;
