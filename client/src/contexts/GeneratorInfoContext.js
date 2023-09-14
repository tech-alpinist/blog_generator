import { createContext, useState, useEffect } from "react";

const GeneratorInfoContext = createContext();

export default GeneratorInfoContext;

export const GeneratorInfoProvider = (props) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listingInfo, setListingInfo] = useState("")
  const [category, setCategory] = useState("");
  const [contentType, setContentType] = useState("");
  const [template, setTemplate] = useState("");
  const [language, setLanguage] = useState('en');
  const [editors, setEditors] = useState([]);
  const [isAuto, setIsAuto] = useState(false)

  useEffect(() => {
    if(props.defaultValue) {
      const _default = props.defaultValue;
      if(_default.title) setTitle(_default.title)
      if(_default.template) setTemplate(_default.template)
      if(_default.category) setCategory(_default.category)
      if(_default.contentType) setContentType(_default.contentType)
      if(_default.description) setDescription(_default.description)
      if(_default.editors) setEditors(_default.editors)
      if(_default.language) setLanguage(_default.language)
      if(_default.listingInfo) setListingInfo(_default.listingInfo)
      if(_default.isAuto) setIsAuto(_default.isAuto)
    }
  }, [props.defaultValue])

  const contextData = {
    title,
    description,
    listingInfo,
    category,
    contentType,
    template,
    language,
    editors,
    isAuto,
    setTitle,
    setDescription,
    setListingInfo,
    setCategory,
    setContentType,
    setTemplate,
    setLanguage,
    setEditors,
    setIsAuto
  };

  return (
    <GeneratorInfoContext.Provider value={contextData}>
      {props.children}
    </GeneratorInfoContext.Provider>
  );
};
