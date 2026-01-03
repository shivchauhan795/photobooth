import React, { useEffect, useState } from 'react'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'
import { AuthEmail, AuthToken } from '../../utils/AuthToken';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageViewer from '../imageViewer/ImageViewer';
import EyeIcon from '../../assets/popups/eyeOpenWhite.svg';
import DownloadIcon from '../../assets/popups/downloadIcon.svg';

const Dashboardd = () => {
    const time = new Date().getHours();
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false);
    const [images, setimages] = useState([]);
    const [activeHoverId, setactiveHoverId] = useState(null);
    const [openViewer, setopenViewer] = useState(false);
    const [imageURLForViewer, setImageURLForViewer] = useState(null);
    const getImages = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/api/media/images/inaccount`, {
                headers: {
                    Authorization: `Token ${AuthToken()}`
                }
            });
            console.log(response.data, 'shiv')
            setimages(response.data)
            setisLoading(false);
        } catch (e) {
            console.log('Error feetching images', e)
            setisLoading(false);
        }
    }
    useEffect(() => {
        setisLoading(true);
        getImages();
    }, [])

    const downloadImage = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `image_${Date.now()}.png`; // or jpg
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    return (
        <div className='h-full bg-[#e3e3e3] flex flex-col justify-between'>
            <div className='h-[95%]'>

                <Navbar />
                <div className='h-[90%] mt-5'>
                    <div className='text-2xl font-bold text-[#000000] text-center pt-5 font-mono'>
                        Good {time >= 6 && time <= 11 ? 'Morning' : time >= 12 && time <= 17 ? 'Afternoon' : 'Evening'}, {AuthEmail().toString().toLowerCase()}
                    </div>
                    {
                        isLoading &&
                        <div className="w-full h-[90%] flex items-center justify-center">
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#218448]"></div>
                            </div>
                        </div>

                    }
                    {
                        !isLoading && images.length == 0 &&
                        <div className='w-full text-center flex flex-col items-center justify-center gap-10 h-[90%]'>
                            <div className='text-lg text-[#000000] font-medium'>

                                No Images. Start capturing and make memories!!
                            </div>
                            <div
                                onClick={() => {
                                    navigate("/capture");
                                }}
                                className="bg-[#248848] w-fit py-4 px-8 rounded-full cursor-pointer text-[#ffffff] text-sm hover:bg-[#1d713c]">
                                Start Creating Now
                            </div>
                        </div>
                    }
                    {
                        !isLoading && images.length != 0 &&
                        <div className='w-full text-center flex gap-10 h-[90%] py-4 px-8 overflow-y-scroll' style={{ scrollbarWidth: 'thin', scrollbarColor: '#218448 #e3e3e3' }}>
                            <div className="flex flex-wrap gap-4 p-4">
                                {images.map((imagesSet, setIndex) =>
                                    imagesSet.url.map((image, imgIndex) => (
                                        <div
                                            key={`${setIndex}-${imgIndex}`}
                                            onMouseEnter={() => setactiveHoverId(`${setIndex}-${imgIndex}`)}
                                            onMouseLeave={() => setactiveHoverId(null)}
                                            className='relative h-fit overflow-hidden'
                                        >
                                            <img
                                                src={image}
                                                alt="uploaded"
                                                className="w-64 h-64 object-cover rounded-lg shadow-xs"
                                            />
                                            {
                                                activeHoverId === `${setIndex}-${imgIndex}` &&
                                                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-5 bg-[#000000]/50 rounded-lg">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <button
                                                            onClick={() => {
                                                                setImageURLForViewer(image);
                                                                setopenViewer(true);
                                                            }}
                                                            className="bg-[#248848] w-fit p-2 rounded-full cursor-pointer hover:bg-[#1d713c] text-[#ffffff]">
                                                            <img src={EyeIcon} alt="view icon" />
                                                        </button>
                                                        <button
                                                            onClick={() => downloadImage(image)}
                                                            className="bg-[#248848] w-fit p-2 rounded-full cursor-pointer hover:bg-[#1d713c] text-[#ffffff]">
                                                            <img src={DownloadIcon} alt="download icon" />
                                                        </button>
                                                    </div>
                                                    <span className='text-[#ffffff] font-bold'>{new Date(imagesSet.date).toLocaleString()}</span>
                                                </div>
                                            }
                                        </div>
                                    ))
                                )}
                            </div>


                        </div>
                    }
                </div>
            </div>
            <Footer />
            {
                openViewer &&
                <ImageViewer imageURL={imageURLForViewer} onClose={() => setopenViewer(false)} />
            }
        </div>
    )
}

export default Dashboardd
