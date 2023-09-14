import { useState, useEffect } from "react";
import Switch from "react-switch";
import { Link } from "react-router-dom";

import ApiController from "utils/ApiController";
import lang from "data/lang";
import types from "data/types";
import config from 'config'
import "./_style.scss";

export default function ItemGenerated(props) {

  const [isPublish, setIsPublish] = useState(true);
  const [lang_img, setLangImg] = useState(null);
  const [type, setType] = useState(null);

  const handleChange = (checked) => {
    const apiController = new ApiController();

    apiController.post('/collection/update_publishing', {
      id: props.item.collection_id,
      isPublished: checked
    })
    .then( response => response.data)
    .then( data => {
      if(data.result == 'success')
        setIsPublish(checked)
      else
        console.log('>> Update publishing Error!')
    })
    .catch(e => console.log(e))
  };

  useEffect(() => {
    const lang_item = lang.find((item) => item.value === props.item.language);
    const type_item = types.find((item) => item.value === props.item.type);
    setLangImg(lang_item?.image);
    setType(type_item?.image);
    setIsPublish(props.item.isPublished);
  }, [props.item]);

  return (
    <>
      <div className="flex items-center">
        <div className="pdf_item flex items-center flex-grow p-4">
          <span className="language_flag">
            <img src={lang_img} alt={props.item.lang} />
          </span>
          <span className="template_name w-full px-4">{props.item.name}</span>
          <span className="created_date px-4">{props.item.createdAt}</span>
          <Switch
            className="publish_switch"
            onChange={handleChange}
            checked={isPublish}
            onColor="#1da886"
            offColor="#1c1c1c"
            checkedIcon={false}
            uncheckedIcon={false}
            width={78}
            height={36}
            borderRadius={6}
            handleDiameter={30}
          />
        </div>
        <span className="type ml-6">
          <Link
            to={`${config.PDF_URL}/${props.item.path}`}
            target="_blank"
          >
            <img className="h-[3.75rem]" src={type} alt={props.item.type} />
          </Link>
        </span>
      </div>
    </>
  );
}
