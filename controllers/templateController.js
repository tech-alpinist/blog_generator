const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Template = require("../models/Templates");

exports.templates = async (req, res) => {
  const templates = await Template.find({});
  return res.json(templates);
};

exports.template = async (req, res) => {
  const { id } = req.params;
  Template.findById(id).then( (template, err ) => {
    if(err) {
      console.log('Not found templated with the id [', id, ']')
      return res.json({result: 'failed'})
    }
    return res.json(template);
  })
  
};

// if the id is existing, create a new template, if else, update
exports.update = async (req, res) => {
  const { prompt, editors, name, id } = req.body;
  if(id) {
    Template.findById(ObjectId(id)).then((template, err) => {
      if(err) {
        console.log(err)
        return res.json({result: 'failed'})
      } else {
        template.name = name;
        template.prompt = prompt;
        template.editors = editors;
        template.save();
        return res.json({ result: "success" });
      }
    })
  } else {
    const template = new Template();
    template.name = name;
    template.prompt = prompt;
    template.editors = editors;
    template.save();
    return res.json({ result: "success" });
  }
  
};
