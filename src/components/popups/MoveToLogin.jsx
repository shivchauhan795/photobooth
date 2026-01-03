import { useNavigate } from 'react-router-dom';
import CloseIcon from '../../assets/popups/closeIcon.svg';

const MoveToLogin = ({ onClose }) => {
    const navigate = useNavigate();
    return (
        <div className='fixed w-full h-full top-0 left-0 flex items-center justify-center bg-[#000000]/50 p-5'>
            <div className='w-fit h-fit flex flex-col  rounded-2xl shadow-xl bg-[#ffffff]'>
                <div className='w-full flex items-center justify-end p-5'>
                    <img src={CloseIcon} alt="close icon" className='w-5 h-5 min-w-5 min-h-5 object-contain shrink-0 cursor-pointer' onClick={() => onClose()} title='Close' />
                </div>
                <div className='flex flex-col items-center justify-center px-3'>

                    <div className='text-2xl font-bold text-[#000000]'>
                        Create an account or login
                    </div>
                    <div className='mt-5 text-center'>
                        <p className='text-lg font-mono text-[#000000]'>
                            You need to create an account or login to save the strip or download individual images.
                        </p>
                    </div>
                    <div className='flex items-center justify-center gap-5 mt-10 mb-10'>
                        <div onClick={() => {
                            onClose();
                            navigate('/login?rtsp=true')
                        }} className="bg-[#248848] w-fit py-3 px-8 rounded-full cursor-pointer hover:bg-[#1d713c] text-[#ffffff]">
                            Continue to Login
                        </div>
                        <div onClick={() => {
                            onClose();
                            navigate('/signup?rtsp=true')
                        }} className="bg-[#248848] w-fit py-3 px-8 rounded-full cursor-pointer hover:bg-[#1d713c] text-[#ffffff]">
                            Continue to Signup
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoveToLogin
