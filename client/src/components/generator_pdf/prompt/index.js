import { useContext, useRef, useState, useEffect } from "react";
import RichEditor from "components/RichEditor";

import { ReactComponent as Edit } from "assets/svg/edit.svg";
import { ReactComponent as Copy } from "assets/svg/copy.svg";
import { ReactComponent as Close } from "assets/svg/close_ring.svg";
import { ReactComponent as Move } from "assets/svg/move.svg";
import img_gpt from "assets/chatgpt-icon.png";
import "./_style.scss";
import ApiController from "utils/ApiController";
import GeneratorInfoContext from "contexts/GeneratorInfoContext";

export default function PromptEditor({
  id,
  title,
  content,
  chapter_id,
  onContentChange,
  onRemove,
}) {
  const [ isGPTGenerating, setIsGPTGenerating ] = useState(false)
  const contentTitle = useRef(title);
  const [currentContent, setCurrentContent] = useState("");
  const {
    title: pdfTitle,
    description,
    category,
    language,
    editors,
    isAuto,
    setIsAuto
  } = useContext(GeneratorInfoContext);

  useEffect(() => {
    if(isAuto) {
      setIsGPTGenerating(true)
      let chapter = editors[chapter_id].content
      let content = [];
      setIsGPTGenerating(true)
      const apiController = new ApiController();
      apiController.post("/generator/content", {
        title: pdfTitle,
        description,
        category,
        language,
        chapter,
        section: title,
      }).then((response) => response.data)
        .then((data) => {
          const result = data.result.split("\n");
          content = result;
          let resultContent = "";
          for (let i = 0; i < content.length; i++) {
            resultContent += `<p>${content[i]}</p>`;
          }

          setCurrentContent(resultContent);
          setIsGPTGenerating(false)
        })
        .catch((e) => console.log(e));
    }
  }, [isAuto])

  useEffect(() => {
    setCurrentContent(content)

    return () => {

    }
  }, [content])

  const onTitleChange = (t) => {
    onContentChange(id, currentContent, t);
    contentTitle.current = t;
  };

  const handleGenerateContentAI = () => {
    if(isGPTGenerating) return;

    let chapter = editors[chapter_id].content
    let content = [];
    setIsGPTGenerating(true)
    const apiController = new ApiController();
    apiController.post("/generator/content", {
      title: pdfTitle,
      description,
      category,
      language,
      chapter,
      section: title,
    }).then((response) => response.data)
      .then((data) => {
        const result = data.result.split("\n");
        content = result;
        let resultContent = "";
        for (let i = 0; i < content.length; i++) {
          resultContent += `<p>${content[i]}</p>`;
        }

        setCurrentContent(resultContent);
        setIsGPTGenerating(false)
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <div className="my-4">
        <div className="flex items-center relative mb-4">
          <div className="move_handler absolute -left-10">
            <Move />
          </div>
          <div className="input-wrapper flex-grow p-4">
            <input
              placeholder="Type your title or ask for an title with a prompt"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <button
            className={`btn_gpt h-fit absolute -right-24 ${isGPTGenerating && 'generating'}`}
            onClick={handleGenerateContentAI}
          >
            <img src={img_gpt} alt="gpt_generate" />
          </button>
          <div className="flex flex-col absolute items-center -right-36 -top-2">
            <button>
              <Edit />
            </button>
            <button onClick={() => {
              if(isGPTGenerating) return
              onRemove(id);
            }}>
              <Close />
            </button>
          </div>
        </div>
        <div className="mb-10">
          <RichEditor
            handleChange={(value) => {
              setCurrentContent(value);
              onContentChange(id, value, contentTitle.current);
            }}
            value={currentContent}
          />
        </div>
      </div>
    </>
  );
}
