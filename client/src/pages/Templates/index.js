import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "layouts/Main";
import { ReactComponent as Plus } from "assets/svg/add.svg";
import "./_style.scss";
import ApiController from "utils/ApiController";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  
  useEffect(() => {
    function fetchData () {
      const apiController = new ApiController();
      apiController
        .get("/template")
        .then((response) => response.data)
        .then((data) => {
          setTemplates(
            data.map((template) => ({ id: template._id, name: template.name }))
          );
        });
    }
    
    fetchData()
    
    return () => {
      setTemplates([])
    }
  }, []);

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
        <div className="h-48"></div>
        <div className="make_template flex justify-between items-center my-4">
          <h3>Make a template</h3>
          <Link
            className="link_template_create flex items-center justify-center"
            to="/template/new"
          >
            <span>Start</span>
            <Plus />
          </Link>
        </div>
        <div className="tempLate_list grid grid-cols-2 gap-8 my-8">
          {templates.map((item, idx) => (
            <div
              key={idx}
              className="template_item flex flex-col items-center justify-center"
            >
              <span className="template_name">{item.name}</span>
              <Link
                className="link_template_edit flex justify-center items-center"
                to={`/template/${item.id}`}
              >
                <span>Edit</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
