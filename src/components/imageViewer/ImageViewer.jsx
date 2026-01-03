import CloseIcon from '../../assets/popups/closeIcon.svg';

const ImageViewer = ({ imageURL, onClose }) => {
    return (
        <div className="fixed w-full h-full top-0 left-0 bg-[#000000]/50 flex items-center justify-center">
            <div className="w-[70%] h-[90%] bg-[#e3e3e3] rounded-xl shadow-2xl flex flex-col p-4">
                <div className='flex items-center justify-end'>
                    <img onClick={() => onClose()} src={CloseIcon} alt="close icon" className='w-7 h-7 min-h-7 min-w-7 object-contain shrink-0 cursor-pointer hover:bg-[#000000]/20 rounded-full p-1' />
                </div>
                <div className='h-[90%] rounded-lg'>
                    <img src={imageURL} alt="image" className='w-full h-full object-contain shrink-0 py-2' />
                </div>
            </div>
        </div>
    )
}

export default ImageViewer
