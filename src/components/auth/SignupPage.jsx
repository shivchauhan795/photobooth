import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import EyeOpen from '../../assets/auth/eyeOpen.svg';
import EyeClose from '../../assets/auth/eyeClose.svg';
import SaveImagesToAccount from '../popups/SaveImagesToAccount';
import { stateContext } from '../../utils/context/stateContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthToken } from "../../utils/AuthToken";
import axios from "axios";

const SignupPage = () => {
    const [searchParams] = useSearchParams();
    const rtsp = searchParams.get("rtsp"); // null if missing

    const navigate = useNavigate();

    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showSaveImagePopup, setshowSaveImagePopup] = useState(false);
    const { urls, seturls, setScreenshots } = stateContext();

    const handleSignup = async () => {
        if (name == '' || email == '' || password == '' || confirmPassword == '') {
            toast.error('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Password does not match');
            return;
        }
        setIsLoading(true)
        try {

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/api/auth/signup`, {
                name, email, password
            });

            if (response.status == 201) {
                toast.success('Signup successfully!!');
                setIsLoading(false);
                setname('');
                setemail('');
                setpassword('');
                setconfirmPassword('');
                if (rtsp == null || rtsp == 'false' || rtsp == undefined || rtsp == '') {
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                } else {
                    setTimeout(() => {
                        navigate('/login?rtsp=true');
                    }, 1000);

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
                    Sign Up
                </div>
                <div className="flex flex-col justify-center items-center gap-5 w-full px-5 mt-5">
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="name" className="text-sm">Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setname(e.target.value);
                            }}
                            className="border border-[#e3e3e3] outline-none rounded-md placeholder:text-[#000000]/20 text-[#222222] text-sm placeholder:text-sm py-2 px-4"
                            placeholder="john"
                            autoFocus
                            autoComplete="off"
                        />
                    </div>
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
                            autoComplete="off"
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
                                autoComplete='off'
                            />
                            <img src={viewPassword ? EyeOpen : EyeClose} onClick={() => setViewPassword(!viewPassword)} alt="" className="absolute top-1 right-3 cursor-pointer hover:bg-[#000000]/20 rounded-full p-1" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="confirmpassword" className="text-sm">Confirm Password:</label>
                        <div className="w-full relative">

                            <input
                                type={viewConfirmPassword ? "text" : "password"}
                                name="confirmpassword"
                                id="confirmpassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setconfirmPassword(e.target.value);
                                }}
                                className="border border-[#e3e3e3] outline-none rounded-md placeholder:text-[#000000]/20 text-[#222222] text-sm placeholder:text-sm py-2 pl-4 pr-14 w-full"
                                placeholder={`${viewConfirmPassword ? "john@12345" : "**********"}`}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        handleSignup()
                                    }
                                }}
                                autoComplete='off'
                            />
                            <img src={viewPassword ? EyeOpen : EyeClose} onClick={() => setViewConfirmPassword(!viewConfirmPassword)} alt="" className="absolute top-1 right-3 cursor-pointer hover:bg-[#000000]/20 rounded-full p-1" />
                        </div>
                    </div>
                </div>
                <div className="w-full text-center mt-5 px-5">
                    <div
                        onClick={() => {
                            if (isLoading) return;
                            handleSignup()
                        }}
                        className="py-2 rounded-full cursor-pointer bg-[#248848] text-[#ffffff]">
                        {isLoading ? "Signing In..." : "Sign Up"}
                    </div>
                </div>
                <div className="px-4 mt-3">
                    Already have an account? <span className="text-[#248848] cursor-pointer hover:underline" onClick={() => { navigate('/login') }}>Login</span>
                </div>
            </div>
            {
                showSaveImagePopup &&
                <SaveImagesToAccount onClose={() => { setshowSaveImagePopup(false) }} save={() => { handleSaveImage() }} />
            }
        </div>
    )
}

export default SignupPage
