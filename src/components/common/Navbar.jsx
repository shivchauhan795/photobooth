import { useRef, useState } from "react";
import { AuthEmail } from "../../utils/AuthToken"
import useOutsideClick from "../../utils/hooks/useOutsideClick";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [openDropdown, setOpenDropdown] = useState(false);
    useOutsideClick(dropdownRef, () => setOpenDropdown(false), openDropdown == true);

    const handleLogout = () => {
        localStorage.removeItem('photobooth_token');
        localStorage.removeItem('photobooth_email');
        toast.success('Logged Out Successfully!!');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    return (
        <div className='px-10 flex items-start justify-between pt-5'>
            <Toaster position="top-right" reverseOrder={false} />
            <div
                onClick={() => navigate('/')}
                className="text-2xl font-mono font-bold cursor-pointer">
                PhotoBooth
            </div>
            {
                AuthEmail() ?
                    <div
                        ref={dropdownRef}
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-[#248848] text-[#ffffff] font-bold relative">
                        {AuthEmail()?.toString()?.charAt(0).toUpperCase()}
                        {
                            openDropdown &&
                            <div className="absolute top-10 right-0 bg-[#ffffff] w-fit border flex flex-col justify-center rounded-lg">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/dashboard')
                                    }}
                                    className="text-[#000000] px-4 py-2 text-sm">
                                    Dashboard
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLogout()
                                        navigate('/')
                                    }}
                                    className="text-[#ff0000] px-4 py-2 text-sm">
                                    Logout
                                </div>
                            </div>
                        }
                    </div> :
                    <div
                        onClick={() => {
                            navigate('/login')
                        }}
                        className="w-fit px-4 py-2 rounded-lg flex items-center justify-center cursor-pointer bg-[#248848] text-[#ffffff] font-bold relative text-sm">Login</div>
            }
        </div>
    )
}

export default Navbar
