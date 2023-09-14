import ReactQuill from "react-quill";
import { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // import the default snow theme
import "./_style.scss"; // import your custom theme

import { ReactComponent as Bold } from "assets/svg/toolbar_bold.svg";
import { ReactComponent as Italic } from "assets/svg/toolbar_italic.svg";

/*
 * Event handler to be attached using Quill toolbar module (see line 73)
 * https://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
}

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = () => (
  <div id="toolbar">
    <select
      className="ql-header"
      defaultValue={"0"}
      onChange={(e) => e.persist()}
    >
      <option value="0" />
      <option value="1" />
      <option value="2" />
      <option value="3" />
    </select>
    <select
      className="ql-align"
      defaultValue={"left"}
      onChange={(e) => e.persist()}
    >
      <option value="left" />
      <option value="center" />
      <option value="right" />
      <option value="justify" />
    </select>
    <button className="ql-bold">
      <Italic />
    </button>
    <button className="ql-italic" />
    <button className="ql-underline" />
    <select className="ql-color" defaultValue={"black"}>
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="black" />
    </select>
    <button className="ql-insertStar">
      <span className="octicon octicon-star">★</span>
    </button>
  </div>
);

const RichEditor = (props) => {

  const customIcons = Quill.import("ui/icons");
  //   customIcons['bold'] = "bold"

  const config = {
    theme: "snow",
    modules: {
      toolbar: {
        container: [
          [{ header: [] }],
          [{ align: [] }],
          [{ color: [] }],
          ["bold", "italic", "underline"],
          [{ list: "bullet" }, { list: "ordered" }],
        ],
      },
    },
    // icons: customIcons
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
  ];

  const handleChange = (value) => {
    props.handleChange(value);
  };

  return (
    <div className="text-editor">
      {/* <CustomToolbar /> */}
      <ReactQuill
        onChange={handleChange}
        modules={config.modules}
        value={props.value}
        // icons={config.icons}
      />
    </div>
  );
};

export default RichEditor;
