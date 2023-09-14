import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate   } from 'react-router-dom';

import { ReactComponent as EyeOff } from 'assets/svg/eye-off.svg'
import { ReactComponent as EyeOn } from 'assets/svg/eye-off.svg'
import { ReactComponent as CheckOff } from 'assets/svg/check_off.svg'
import { ReactComponent as CheckOn } from 'assets/svg/check_off.svg'
import img_signin from 'assets/sign_in.png'
import img_boocademy from 'assets/boocademy_logo.png'
import './_login.scss';

import ApiController from "utils/ApiController";

function Login () {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ isPWVisible, setIsPWVisible ] = useState(false)
    const [ isRemember, setIsRemember ] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const login = ({email, password}) => {
        const apiController = new ApiController();
        const data = {
            email, password
        }
        apiController
            .post('/auth/login', data)
            .then((response) => {
                console.log(response)
                dispatch({
                    type: 'login',
                    payload: {
                        email: "brain@boocademy.com",
                        name: 'Brian',
                        role: 'admin'
                    }
                })
                navigate('/templates')
            })
            .catch((e) => console.log(e));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData)
    }

    return (
    <div className="flex w-full h-fit">
        <img className="" src={img_signin} alt="" />
        <div className='sign_in flex flex-col flex-grow items-center justify-center px-28'>
            <img src={img_boocademy} alt='' />
            <h4 className='mt-6'>Login to your account</h4>
            <form className='flex flex-col w-full my-8' onSubmit={handleSubmit}>
                <div className='flex flex-col'>
                    <label className='' htmlFor='email'>Email Address <span>*</span></label>
                    <input name='email' type='text' placeholder='Input your registerd email'
                        onChange={handleInputChange}
                    />
                </div>
                <div className='flex flex-col my-6 relative'>
                    <label className='' htmlFor='password'>Password <span>*</span></label>
                    <input className='' name='password' type={isPWVisible ? 'text' : 'password'} placeholder='Input your password' 
                        onChange={handleInputChange}
                    />
                    <span className='cursor-pointer absolute right-2 top-12' onClick={() => {
                        setIsPWVisible(!isPWVisible)
                    }}>
                        {
                            isPWVisible ? <EyeOn /> : <EyeOff />
                        }
                    </span>
                </div>
                <div className='flex justify-between'>
                    <div className='check_remember flex items-center cursor-pointer' onClick={() => {
                        setIsRemember(!isRemember)
                    }}>
                        {
                            isRemember ? <CheckOn /> : <CheckOff />
                        }
                        <span className='ml-2'>
                            Remember Me
                        </span>
                    </div>
                    <Link to='/forgot' className='link_forgot'>Forgot Password</Link>
                </div>
                <button type="submit" className='flex items-center justify-center btn_login mt-8'>
                    <span>Login</span>
                </button>
            </form>
            <div>
                <span className='plain_text'>You're new in here? </span>
                <Link to='/signup' className='link_signup'>Create Account</Link> 
            </div>
            <div className='flex justify-between'>
                <span className='plain_text'>
                    © 2023 Boocademy . Alrights reserved.
                </span>
                <span>
                    <Link to='/terms_conditions' className='link_term_condition'>Terms & Conditions</Link>
                    <Link to='/policy' className='link_policy'>Privacy Policy</Link>
                </span>
                
            </div>
            
        </div>
    </div>
    );
}

export default Login;
