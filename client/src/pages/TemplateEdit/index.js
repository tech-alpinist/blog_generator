import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GeneratorInfoProvider } from "contexts/GeneratorInfoContext";
import MainLayout from "layouts/Main";
import PromptEditor from "components/generator_pdf/prompt";
import ChapterEditor from "components/generator_pdf/chapter";
import { ReactComponent as Plus } from "assets/svg/add.svg";
import "./_style.scss";
import ApiController from "utils/ApiController";
import Loading from "components/Loading";

export default function TemplatesEdit() {
  const { id } = useParams();

  const [editors, setEditors] = useState([]);
  const [mainPrompt, setMainPrompt] = useState("");
  const [mainTitle, setMainTitle] = useState("New Template");

  const [ isGenerating, setIsGenerating ] = useState(false);

  const navigate = useNavigate();

  const validateTemplate = () => {
    // should have template name, main prompt, at least one chapter and one prompt
    let error = 0;
    if(mainTitle === '') {
      error++;
      console.log('>> Please input template name...')
    }
    if(mainPrompt === '') {
      error++;
      console.log('>> Please input main prompt...')
    }
    if(editors.length == 0) {
      error++;
      console.log('>> Template should includes at least one of chapter or prompt')
    }
    
    if(error == 0) return true

    return false
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

  const handleSaveTemplate = () => {
    if(!validateTemplate()) return;
    
    const apiController = new ApiController();
    const data = {
      id,
      name: mainTitle,
      prompt: mainPrompt,
      editors: editors.map(item => {
        const {_id, ...rest} = item
        return rest
      })
    };

    setIsGenerating(true)
    apiController
      .post("/template/update", data)
      .then((response) => response.data)
      .then((data) => {
        setIsGenerating(false)
        
        if(data.result == 'success')
          navigate('/templates')
        else
          console.log('>> Template Generating Error!')
      })
      .catch((e) => console.log(e));
    
  };

  useEffect(() => {
    if (id) {
      const apiController = new ApiController();
      apiController
        .get(`/template/${id}`)
        .then((response) => response.data)
        .then((data) => {
          if(data.result=='failed') return
          console.log(data.editors)
          setEditors(data.editors);
          setMainPrompt(data.prompt);
          setMainTitle(data.name);
        });
    }
  }, [id]);

  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="hero-section flex flex-col items-center justify-center px-10">
          <h1 className="hero-headline">Templates</h1>
          <p className="hero-text">
            With the template maker, we can create pre-filled templates. These
            templates are easy to use for generating PDFs in bulk, eliminating the
            need to start from scratch each time.
          </p>
        </div>
        <div className="h-32"></div>
        <div className="save_template flex justify-between items-center my-10">
          <input
            className="template_name flex-1 mr-24"
            type="text"
            maxLength={50}
            value={mainTitle}
            placeholder="Template name"
            onChange={(e) => [setMainTitle(e.target.value)]}
          />
          <button
            className="btn_template_save flex items-center justify-center"
            onClick={() => {
              handleSaveTemplate();
            }}
          >
            <span>Save</span>
          </button>
        </div>
        <GeneratorInfoProvider defaultValue={{
          title: '',
          description: mainPrompt,
          language: 'en',
          editors: editors,
        }}>
        <div className="template_generate flex justify-between items-center mb-28">
          <h3>Generated template</h3>
          <div className="flex flex-wrap gap-4">
            <button
              className="btn_prompt"
              onClick={() => {
                const newPrompt = {
                  _id: new Date().getTime(),
                  type: "content",
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

        <div className="template-generator-section">
          <div className="main_prompt">
            <h4 className="mb-4">Main Prompt</h4>
            <div className="input-wrapper flex-grow p-4">
              <textarea
                className=""
                name="main-prompt"
                placeholder='Write a sales explanation for an e-book on the subject: Take the title from point 1 in the basic information). With an extensive introduction and including objectives, target audience, and outcomes + 5 titles of knowledge chapters in the second person form. Please make the headings (such as objectives, target audience, and outcomes) bold, and the knowledge chapters in bullet points.
                              
                              Mention 2 titles for case studies of well-known companies, state the title of the practical assignment, provide a title for a personal and an organizational questionnaire.
                              
                              Also, add that in the e-book, under the "Approach" section, we utilize various forms such as theory in practical chapters, case studies, practical assignments, and a personal questionnaire and/or organizational questionnaires, along with useful templates and step-by-step guides. Conclude this section with These methods enable you to (listing).
                              End with downloading this e-book and embarking on lifelong learning.'
                value={mainPrompt}
                onChange={(e) => setMainPrompt(e.target.value)}
              />
            </div>
          </div>
          {
            editors.map((editor, idx) => {
              if (editor.type === "chapter")
                return (
                  <ChapterEditor
                    key={idx}
                    content={editor.content}
                    id={editor._id}
                    onContentChange={handleUpdateEditorContent}
                    onRemove={handleRemoveEditor}
                  />
                );
              else if (editor.type === "content")
                return (
                  <PromptEditor
                    key={idx}
                    content={editor.content}
                    title={editor.title}
                    id={editor._id}
                    onContentChange={handleUpdateEditorContent}
                    onRemove={handleRemoveEditor}
                  />
                );
              else return <div>Error has occured!</div>;
            })
          }
          <button
            className="btn_save_template flex justify-center items-center w-full mt-14 mb-20"
            onClick={handleSaveTemplate}
          >
            <span>Save template</span>
          </button>
        </div>
        </GeneratorInfoProvider>
      </div>
      {
        isGenerating && <Loading text='generating...' />
      } 
    </MainLayout>
  );
}
