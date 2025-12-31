import { useEffect, useRef } from "react";
import { stateContext } from "../../utils/context/stateContext";
import { redirect, useNavigate } from "react-router-dom";

const Customize = () => {
    const navigate = useNavigate();
    const stripCanvasRef = useRef(null);
    const { screenshots, setScreenshots } = stateContext()

    const createPhotoStrip = async () => {
        if (screenshots.length === 0) return;

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

        const photoWidth = 360;
        const photoHeight = 260;
        const padding = 20;
        const headerHeight = 80;

        const canvas = stripCanvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = photoWidth + padding * 2;
        canvas.height =
            images.length * photoHeight +
            padding * (images.length + 1) +
            headerHeight;

        // Background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header text
        ctx.fillStyle = "#fff";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PhotoBooth", canvas.width / 2, 50);

        // Draw photos vertically
        images.forEach((img, i) => {
            const y =
                headerHeight +
                padding +
                i * (photoHeight + padding);

            // white border
            ctx.fillStyle = "#fff";
            ctx.fillRect(
                padding - 6,
                y - 6,
                photoWidth + 12,
                photoHeight + 12
            );

            ctx.drawImage(
                img,
                padding,
                y,
                photoWidth,
                photoHeight
            );
        });
    };

    const downloadStrip = () => {
        const link = document.createElement("a");
        link.download = "photobooth-strip.png";
        link.href = stripCanvasRef.current.toDataURL("image/png");
        link.click();
    };

    useEffect(() => {
        if (screenshots.length === 3) {
            createPhotoStrip();
        } else {
            navigate('/')
        }
    }, [screenshots]);



    return (
        <div className="h-screen">
            {screenshots.length === 3 && (
                <div className="flex flex-col items-center h-full border pt-5">
                    <canvas
                        ref={stripCanvasRef}
                        className="mb-4 h-[80%]"
                    />

                    <button
                        onClick={downloadStrip}
                        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                    >
                        Download Strip 📥
                    </button>
                </div>
            )}
        </div>
    )
}

export default Customize
