import { useState } from "react";
import EyeOpen from '../../assets/auth/eyeOpen.svg';
import EyeClose from '../../assets/auth/eyeClose.svg';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import SaveImagesToAccount from "../popups/SaveImagesToAccount";
import { stateContext } from "../../utils/context/stateContext";
import { AuthToken } from "../../utils/AuthToken";

const LoginPage = () => {
    const [searchParams] = useSearchParams();
    const rtsp = searchParams.get("rtsp"); // null if missing

    const navigate = useNavigate();
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('')
    const [viewPassword, setViewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSaveImagePopup, setshowSaveImagePopup] = useState(false);
    const { urls, seturls, setScreenshots } = stateContext();

    const handleLogin = async () => {
        if (email == '' || password == '') {
            toast.error('All fields are required');
            return;
        }
        setIsLoading(true)
        try {

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/api/auth/login`, {
                email, password
            });

            if (response.status == 200) {
                localStorage.setItem('photobooth_token', response.data.token);
                localStorage.setItem('photobooth_email', email);
                toast.success('Login successfully!!');
                setIsLoading(false);
                setemail('');
                setpassword('');
                if (rtsp == null || rtsp == 'false' || rtsp == undefined || rtsp == '') {

                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                } else {
                    setshowSaveImagePopup(true);
                }
            } else {
                toast.error(response.data.message);
                setIsLoading(false);
            }
        } catch (e) {
            toast.error(e.response.data.message);
            setIsLoading(false);
        }

    }

    const handleSaveImage = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/api/media/images/inaccount`, {
                urls
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

    return (
        <div className='h-full border w-full flex items-center justify-center text-black'>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="border border-[#e3e3e3] shadow-lg rounded-2xl w-1/3 max-sm:w-[90%] h-fit px-2 pt-5 pb-9">
                <div className="text-center text-2xl text-[#000000] font-bold uppercase">
                    Login
                </div>
                <div className="flex flex-col justify-center items-center gap-5 w-full px-5 mt-5">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="email" className="text-sm">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setemail(e.target.value);
                            }}
                            className="border border-[#e3e3e3] outline-none rounded-md placeholder:text-[#000000]/20 text-[#222222] text-sm placeholder:text-sm py-2 px-4"
                            placeholder="john@gmail.com"
                            autoFocus
                            autoComplete="on"
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="password" className="text-sm">Password:</label>
                        <div className="w-full relative">

                            <input
                                type={viewPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setpassword(e.target.value);
                                }}
                                className="border border-[#e3e3e3] outline-none rounded-md placeholder:text-[#000000]/20 text-[#222222] text-sm placeholder:text-sm py-2 pl-4 pr-14 w-full"
                                placeholder={`${viewPassword ? "john@12345" : "**********"}`}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        handleLogin()
                                    }
                                }}
                            />
                            <img src={viewPassword ? EyeOpen : EyeClose} onClick={() => setViewPassword(!viewPassword)} alt="" className="absolute top-1 right-3 cursor-pointer hover:bg-[#000000]/20 rounded-full p-1" />
                        </div>
                    </div>
                </div>
                <div className="w-full text-center mt-5 px-5">
                    <div
                        onClick={() => {
                            if (isLoading) return;
                            handleLogin()
                        }}
                        className="py-2 rounded-full cursor-pointer bg-[#248848] text-[#ffffff]">
                        {isLoading ? "Logging In..." : "Login"}
                    </div>
                </div>
                <div className="px-4 mt-3">
                    Don't have an account? <span className="text-[#248848] cursor-pointer hover:underline" onClick={() => { navigate('/signup') }}>Signup</span>
                </div>
            </div>
            {
                showSaveImagePopup &&
                <SaveImagesToAccount onClose={() => { setshowSaveImagePopup(false) }} save={() => { handleSaveImage() }} />
            }
        </div>
    )
}

export default LoginPage
