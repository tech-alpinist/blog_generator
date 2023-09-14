import { Link } from "react-router-dom";

import img_boocademy from 'assets/boocademy_logo.png'

import './_style.scss';

export default function Collection (props) {

    return (
        <Link to={`/collection/${props.data._id}`}>
            <div className='collection_item flex flex-col items-center justify-between p-4'>
                <span className='category'>{props.data.category}</span>
                <div className='flex flex-col items-center justify-between my-12'>
                    <span className='title mb-8'>
                        {props.data.title}
                    </span>
                    <span className='type'>{props.data.type}</span>
                </div>
                <img className='logo' src={img_boocademy} alt='boocademy' />
            </div>
        </Link>
    )
}