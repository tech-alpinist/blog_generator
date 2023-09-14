import { ReactComponent as LoadingSVG } from 'assets/svg/loading.svg'
import './_loading.scss';

function Loading (props) {

  return (
    <div className='modal-overlay'>
      <div className="loading-container">
        <LoadingSVG id='loading_svg'/>
        <span>{props.text}</span>
        <span>Boocademy Generator</span>
      </div>
    </div>
  );
}

export default Loading;
