import img_boocademy from 'assets/boocademy_logo.png' 
import './_style.scss';

export default function Footer () {

    return (
        <div className='footer px-20'>
            <div className='footer-top flex py-16 justify-between'>
                <div className='footer-left flex flex-col items-center justify-between'>
                    <img src={img_boocademy} alt='boocademy' />
                    <p>
                        Lifelong Learning accessible to everyone. Clear, simple yet highly effective learning products.
                    </p>
                </div>
                <div className='footer-middle flex flex-wrap gap-20 mt-12'>
                    <div className='flex flex-col flex-wrap gap-2'>
                        <span className='footer_header'>The Library</span>
                        <span className='footer_item flex'>
                            Collection
                            <div className='badge_new ml-4'>
                                <span>New</span>
                            </div>
                        </span>
                        <span className='footer_item'>How does it work</span>
                        <span className='footer_item'>Pricing</span>
                        <span className='footer_item'>Employers</span>
                        <span className='footer_item'>About Us</span>
                        <span className='footer_item'>Mission statement</span>
                    </div>
                    <div className='flex flex-col flex-wrap gap-2'>
                        <span className='footer_header'>Resources</span>
                        <span className='footer_item'>Inclusion</span>
                        <span className='footer_item'>Careers</span>
                        <span className='footer_item'>Press</span>
                        <span className='footer_item'>Investors</span>
                        <span className='footer_item'>FAQ</span>
                        <span className='footer_item'>Advisory Board</span>
                    </div>
                </div>
                <div className='footer-right flex flex-col mt-12'>
                    <span>Stay up to date</span>
                    <div className='mt-4'>
                        <input placeholder='Enter your email' />
                        <button className='ml-4'>
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className='footer-bottom flex justify-between py-6'>
                <span className='copyright'>
                    © 2023 Boocademy All rights reserved.
                </span>
                <div className='contact flex flex-wrap gap-5'>
                    <a>Contact</a>
                    <a>Terms</a>
                    <a>Privacy</a>
                    <a>Coookies</a>
                </div>
            </div>
        </div>
    )
}   