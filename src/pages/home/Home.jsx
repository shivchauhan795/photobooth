import { useEffect, useRef, useState } from "react";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    


    return (
        <div className="bg-[#e3e3e3] min-h-screen flex flex-col justify-between">
            <h1 className="text-2xl font-bold text-center pt-5 uppercase">
                PhotoBooth
            </h1>

            <div className="text-center font-mono text-2xl">
                Capture your best smile and share it with the world!
            </div>
            <div className="text-sm font-medium text-[#ffffff] text-center w-full flex justify-center items-center">
                <div
                    onClick={() => {
                        navigate("/capture");
                    }}
                    className="bg-[#248848] w-fit py-4 px-8 rounded-full cursor-pointer hover:bg-[#1d713c]">
                    Start Capturing
                </div>
            </div>

            <div className="w-full mt-20">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
