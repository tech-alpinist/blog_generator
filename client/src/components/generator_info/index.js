import { useEffect, useState, useContext } from "react";
import Select from "react-select";

import Loading from 'components/Loading'
import img_gpt from "assets/chatgpt-icon.png";
import lang from "data/lang";

import "./_style.scss";
import GeneratorInfoContext from "contexts/GeneratorInfoContext";
import ApiController from "utils/ApiController";
import categories from "data/categories";
import { parseOutline } from "utils/template";

export default function BasicInfoGenerator() {
  const {
    title,
    description,
    listingInfo,
    category,
    contentType,
    template,
    language,
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
  } = useContext(GeneratorInfoContext);

  const [ topic, setTopic ] = useState('')
  const [ templates, setTemplates ] = useState([]);
  const [ isGenerating, setIsGenerating ] = useState(false)
  const [ isGPTGenerating, setIsGPTGenerating ] = useState(false)
  const [ isAutoGenerating, setIsAutoGenerating ] = useState(false)

  useEffect(() => {
    const apiController = new ApiController();
    apiController
      .get("/template")
      .then((response) => response.data)
      .then((data) => {
        setTemplates(
          data.map((template) => ({ id: template._id, name: template.name }))
        );
      });
  }, []);

  const handleTitleGPT = () => {
    setIsGPTGenerating(true)
    setTopic(title)
    const apiController = new ApiController();
    apiController
      .post("/generator/title", {
        text: title
      })
      .then((response) => response.data)
      .then((data) => {
        setIsGPTGenerating(false)
        setTitle(data.result.replace(/"/g, ''))
      });
  }

  const handleDescriptionGPT = () => {
    setIsGPTGenerating(true)
    const apiController = new ApiController();
    apiController
      .post("/generator/description", {
        text: description,
        topic: topic
      })
      .then((response) => response.data)
      .then((data) => {
        setIsGPTGenerating(false)
        setDescription(data.result)
      });
  }

  const handleListingInfoGPT = () => {
    setIsGPTGenerating(true)
    const apiController = new ApiController();
    apiController
      .post("/generator/listing_info", {
        text: listingInfo,
        topic: topic
      })
      .then((response) => response.data)
      .then((data) => {
        setIsGPTGenerating(false)
        setListingInfo(data.result)
      });
  }

  const validateBasicInfo = () => {

    let error = 0;

    if(title == '') {
      error++;
      console.log('>> Please input title...')
    }
    if(description == '') {
      error++;
      console.log('>> Please input main prompt...')
    }
    if(category == '') {
      error++;
      console.log('>> Please select category...')
    }
    if(language == '') {
      error++;
      console.log('>> Please select language...')
    }

    if(error == 0) return true;
    return false
  }

  const handleGenerateTemplate = async () => {
    if(!validateBasicInfo()) return;
    const data = {
      title,
      description,
      category: categories.find(
        (value, ind) => ind + 1 === parseInt(category)
      ),
      language: lang.find( l => l.value == language).label
    }
    setIsGenerating(true)
    const apiController = new ApiController();
    apiController.post("/generator/template", data)
      .then((response) => response.data)
      .then(data => {
        if(data.result == 'failed') return
        const { chapters, sections } = parseOutline(
          data.result
        );
        const editors = [];
        let idx = 0
        for (let i = 0; i < chapters.length; i++) {
          editors.push({
            _id: idx,
            type: "chapter",
            content: chapters[i],
          });
          idx++;
  
          for (let j = 0; j < sections[i].length; j++) {
            editors.push({
              _id: idx,
              type: "content",
              title: sections[i][j],
              content: "",
              chapter_id: idx - j - 1,
            })
            idx++
          }
        }
        
        setEditors(editors);
        setIsGenerating(false)
        // asking continue to generate contents
        setIsAutoGenerating(true)
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="basic-prompt-section px-20">
      <h3>Basic information</h3>
      <div className="basic-prompt-container">
        <div className="template prompt relative mt-3">
          <div className="atom-filled absolute -left-20">
            <span>0</span>
          </div>
          <div className="input-wrapper">
            <select
              className="py-4 mx-4"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option value="" disabled hidden>
                Select a template
              </option>
              {
                templates.map( (item, idx) => 
                  <option key={idx} value={item.id}>{item.name}</option>
                )
              }
            </select>
          </div>
        </div>
        <div className="title prompt flex items-center relative mt-4">
          <div className="atom-filled absolute -left-20">
            <span>1</span>
          </div>
          <div className="flex flex-col w-full">
            <h4>Main title/topic</h4>
            <div className="input-wrapper flex-grow p-4">
              <input
                placeholder="Type your title or ask for an title with a prompt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <button
            className={`btn_gpt h-fit absolute -right-24 top-10 ${isGPTGenerating && 'generating'}`}
            onClick={() => {
              handleTitleGPT()
            }}
          >
            <img src={img_gpt} alt="gpt_generate" />
          </button>
        </div>
        <div className="description prompt flex relative mt-4">
          <div className="atom-filled absolute -left-20">
            <span>2</span>
          </div>
          <div className="flex flex-col w-full">
            <h4>Main prompt</h4>
            <div className="input-wrapper flex-grow p-4">
              <textarea
                className=""
                placeholder="Type a short description PROMPT about your e-book project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <button
            className={`btn_gpt h-fit absolute -right-24 top-10 ${isGPTGenerating && 'generating'}`}
            onClick={() => {
              handleDescriptionGPT()
            }}
          >
            <img src={img_gpt} alt="gpt_generate" />
          </button>
        </div>

        <div className="listing_info prompt flex relative mt-4">
          <div className="atom-filled absolute -left-20">
            <span>3</span>
          </div>
          <div className="flex flex-col w-full">
            <h4>Listing infomation</h4>
            <div className="input-wrapper flex-grow p-4">
              <textarea
                className=""
                placeholder="Generate a short introduction text about learning product based on title in 1"
                value={listingInfo}
                onChange={(e) => setListingInfo(e.target.value)}
              />
            </div>
          </div>
          <button
            className={`btn_gpt h-fit absolute -right-24 top-10 ${isGPTGenerating && 'generating'}`}
            onClick={() => {
              handleListingInfoGPT()
            }}
          >
            <img src={img_gpt} alt="gpt_generate" />
          </button>
        </div>

        <div className="category prompt mt-6">
          <div className="input-wrapper">
            <select
              className="py-4 mx-4"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled hidden>
                Select a category
              </option>
              {
                categories.map((category, idx) => (
                  <option key={idx} value={category}>{category}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="type prompt mt-3">
          <div className="input-wrapper">
            <select
              className="py-4 mx-4"
              required
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="" disabled hidden>
                Select a type of learning product
              </option>
              <option value="ebook">E-Book</option>
              <option value="audio">Audio-Book</option>
              <option value="assignments">Assignments</option>
              <option value="casestudy">Case Studies</option>
              <option value="scans">Scans</option>
              <option value="podcast">Podcast</option>
            </select>
          </div>
        </div>

        <div className="language mt-8">
          <div className="language-wrapper">
            <Select
              className="py-4 mx-4"
              value={lang.find(l => l.value == language)}
              options={lang}
              getOptionLabel={(option) => (
                <div className="flex items-center">
                  <img
                    className="lang_flag"
                    src={option.image}
                    alt={option.label}
                  />
                  <span className="lang_text">{option.label}</span>
                </div>
              )}
              styles={{
                control: (base) => ({
                  ...base,
                  border: 0,
                  outline: "none",
                  boxShadow: "none",
                }),
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              onChange={(newValue) => {
                setLanguage(newValue.value)
              }}
            />
          </div>
        </div>
        <button
          className="btn_generate_basic_info w-full flex justify-center items-center flex-wrap gap-6 mt-4"
          onClick={handleGenerateTemplate}
        >
          <span className="text-white">Start generating</span>
          <img className="h-[3rem]" src={img_gpt} alt="gpt" />
        </button>
      </div>
      {
        isGenerating && <Loading text='generating...' />
      }
      {
        isAutoGenerating && 
        <div className="modal-overlay">
          <div className="flex flex-col flex-wrap gap-8 h-48 w-1/2 justify-center items-center bg-white rounded-xl">
            <div className="text-black font-bold text-2xl">
              Continue to generate contents?
            </div>
            <div className="flex flex-wrap gap-12 justify-center items-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={() => {
                  setIsAutoGenerating(false)
                  setIsAuto(true)
                }}
              >Yes</button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                onClick={() => {
                  setIsAutoGenerating(false)
                  setIsAuto(false)
                }}
              >No</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
