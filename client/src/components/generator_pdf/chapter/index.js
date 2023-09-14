import { ReactComponent as Edit } from "assets/svg/edit.svg";
import { ReactComponent as Close } from "assets/svg/close_ring.svg";
import { ReactComponent as Move } from "assets/svg/move.svg";

import "./_style.scss";

export default function ChapterEditor({
  id,
  content,
  onContentChange,
  onRemove,
}) {
  return (
    <>
      <div className="my-4">
        <div className="flex items-center relative">
          <div className="move_handler absolute -left-10 top-2">
            <Move />
          </div>
          <div className="chapter-input-wrapper flex flex-grow mb-5 py-2">
            <input
              className="ml-1"
              placeholder="Type Chapter title"
              defaultValue={content}
              onChange={(e) => onContentChange(id, e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center absolute -right-10 -top-4">
            <button>
              <Edit />
            </button>
            <button onClick={() => onRemove(id)}>
              <Close />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
