import { useState, useEffect, useContext } from "react";

import Loading from "components/Loading";
import PromptEditor from "components/generator_pdf/prompt";
import ChapterEditor from "components/generator_pdf/chapter";
import ItemGenerated from "components/generator_pdf/ItemGenerated";
import { ReactComponent as Plus } from "assets/svg/add.svg";
import img_pdf from "assets/pdf-icon.png";
import GeneratorInfoContext from "contexts/GeneratorInfoContext";

import "./_style.scss";
import ApiController from "utils/ApiController";

export default function PDFGenerator() {

  const [ isGenerating, setIsGenerating ] = useState(false)
  const [ items, setItems ] = useState([]);

  const {
    title,
    template,
    category,
    contentType,
    language,
    description,
    listingInfo,
    editors,
    setEditors,
    setDescription,
  } = useContext(GeneratorInfoContext);

  useEffect(() => {
    if(template) {
      const apiController = new ApiController();
      apiController
        .get(`/template/${template}`)
        .then(response => response.data)
        .then(data => {
          console.log(data)
          if(data.result == 'failed') return;
          setEditors(data.editors);
          setDescription(data.prompt);
        });
    }
    
  }, [template]);

  const getChapterID = (id) => {
    if(id == 0) return 0;
    for (let i = id - 1; i > 0; i--) {
      if (editors[i].type === "chapter") {
        return i
      }
    }
    return 0
  }

  const validateContents = () => {
    let error = 0;
    if(title == '') error++;
    if(category == '') error++;
    if(contentType == '') error++;
    if(language == '') error++;
    if(description == '') error++;
    if(listingInfo == '') error++;
    if(editors.length == 0) error++;

    if(error == 0) return true;
    return false;
  }

  const handleUpdateEditorContent = (id, content, title) => {
    const currentEditorIndex = editors.findIndex((editor) => editor._id === id);
    const updatedEditor = { ...editors[currentEditorIndex] };
    updatedEditor.content = content;
    if (updatedEditor.type === "content") {
      updatedEditor.title = title;
    }
    const updatedEditors = editors.slice();
    updatedEditors[currentEditorIndex] = updatedEditor;
    setEditors(updatedEditors);
  };

  const handleRemoveEditor = (id) => {
    const filteredEditors = editors.filter((editor) => editor._id !== id);
    setEditors(filteredEditors.slice());
  };

  const handleGeneratePDF = () => {
    if(!validateContents()) return;

    setIsGenerating(true)
    const apiController = new ApiController();

    const collectionInfo = {
      title,
      contentType,
      category,
      language,
      description,
      listingInfo,
      editors: editors.map( item => {
        const { _id, ...rest } = item
        return rest
      }),
      isPublished: true
    };

    apiController.post("/collection/update", collectionInfo)
      .then(response => response.data)
      .then(data => {
        console.log(data)
        if(data.result=='success') {
          const pdfInfo = {
            title,
            contentType,
            category,
            language,
            collection_id: data.id,
            editors,
          }

          console.log(pdfInfo)

          apiController
            .post("/generator/pdf", pdfInfo)
            .then((response) => response.data)
            .then( data => {
              setIsGenerating(false)
              if (data.result === "success") {
                const today = new Date();
                const month = today.getMonth() + 1;
                const day = today.getDate();
                const year = today.getFullYear();
                // Format the date as "MM/DD/YYYY"
                const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
      
                const newItem = {
                  path: data.path,
                  language,
                  name: title,
                  collection_id: pdfInfo.collection_id,
                  createdAt: formattedDate,
                  isPublished: true,
                  type: contentType,
                };
                console.log(newItem)
                setItems([...items, newItem]);
              }
            })
            .catch((e) => console.log(e));

        }
      })
      .catch(e => console.log(e))
  }
  
  return (
    <>
      <div className="mt-28 px-20">
        <div className="template-generate flex justify-between mb-28">
          <h3>Generated template</h3>
          <div className="flex flex-wrap gap-4">
            <button
              className="btn_prompt"
              onClick={() => {
                const newPrompt = {
                  _id: editors.length,
                  type: "content",
                  chapter_id: getChapterID(editors.length),
                  title: "",
                  content: "",
                };
                setEditors([...editors, newPrompt]);
              }}
            >
              <Plus />
              <span>PROMPT</span>
            </button>
            <button
              className="btn_chapter"
              onClick={() => {
                const newChapter = {
                  _id: new Date().getTime(),
                  type: "chapter",
                  content: "",
                };
                setEditors([...editors, newChapter]);
              }}
            >
              <span>Chapter</span>
              <Plus />
            </button>
          </div>
        </div>
        <div className="pdf-editor-section">
          {editors.map((editor, idx) => {
            if (editor.type === "chapter")
              return (
                <ChapterEditor
                  key={idx}
                  id={editor._id}
                  content={editor.content}
                  onContentChange={handleUpdateEditorContent}
                  onRemove={handleRemoveEditor}
                />
              );
            else if (editor.type === "content")
              return (
                <PromptEditor
                  key={idx}
                  id={editor._id}
                  title={editor.title}
                  content={editor.content}
                  chapter_id={editor.chapter_id}
                  onContentChange={handleUpdateEditorContent}
                  onRemove={handleRemoveEditor}
                />
              );
            else return <div>Error has occured!</div>;
          })}
        </div>
      </div>
      <div className="pdf-generator-section mt-28">
        <button
          className="btn_generate_pdf w-full flex justify-center items-center flex-wrap gap-6 my-4"
          onClick={() => {
            handleGeneratePDF();
          }}
        >
          <span className="text-white">Start generating</span>
          <img className="h-[3rem]" src={img_pdf} alt="pdf" />
        </button>

        <div className="pdf_list p-11">
          <h3>Generated pdf's</h3>
          <div className="list flex flex-col flex-wrap gap-6 mt-6">
            {items.map((item, idx) => (
              <ItemGenerated
                key={idx}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>
      {
        isGenerating && <Loading text="generating..." />
      }
    </>
  );
}
