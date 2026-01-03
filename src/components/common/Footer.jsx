import { Link } from "react-router-dom";
import Github from '../../assets/footer/github.svg'
import Linkedin from '../../assets/footer/linkedin.svg'
import Twitter from '../../assets/footer/twitter.svg'

const Footer = () => {
    const pathname = window.location.pathname;
    const date = new Date().getFullYear();
    return (
        <div className='px-20 pb-2 max-lg:px-10'>
            <div className='flex max-sm:flex-col max-sm:gap-10 items-start justify-between mb-0'>
                {
                    pathname == '/' &&
                    <div className="flex max-sm:flex-col max-sm:gap-2 items-start justify-between mb-16 w-full">
                        <div className='myfont font-semibold text-xl mb-6'>
                            Follow me on:
                        </div>
                        <div className='flex gap-4'>
                            <img onClick={() => window.open('https://www.linkedin.com/in/shivchauhan795/')} src={Linkedin} alt="linkedin" className='w-12 h-12 object-contain cursor-pointer' />
                            <img onClick={() => window.open('https://github.com/shivchauhan795/')} src={Github} alt="github" className='w-12 h-12 object-contain cursor-pointer' />
                            <img onClick={() => window.open('https://twitter.com/shivchauhan795')} src={Twitter} alt="twitter" className='w-12 h-12 object-contain cursor-pointer' />
                        </div>
                    </div>
                }
            </div>
            <div className='text-center text-black opacity-55 text-sm max-sm:text-xs font-normal'>
                © {date} - Shiv Chauhan. All Right Reserved.
            </div>
        </div>
    )
}

export default Footer
