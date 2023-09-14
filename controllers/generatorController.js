const path = require("path");
const fs = require("fs");
const pdf = require("pdf-parse");
const html_to_pdf = require("html-pdf-node");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Template = require("../models/Templates");

const Collection = require('../models/Collections')
const apiKey = process.env.OPENAI_API_KEY || '';

exports.translate_downloadPDF = async (req, res) => {
  const {id, lang_label, lang_val} = req.body
  Collection.findById(ObjectId(id)).then( async (collection, err) => {

    if(err) {
      console.log(err)
      return res.json({result: 'failed'})
    } else {
      console.log(collection._id)
      // generate PDF
      let options = {
        width: 1537,
        height: 2049,
        margin: {
          top: 77,
          right: 72,
          bottom: 77,
          left: 72,
        },
        printBackground: true,
        path: path.join(__dirname, "..", `assets/generated/pdf/${collection._id}_${lang_val}.pdf`),
      };

      const imageAsBase64 = fs.readFileSync(
        path.join(__dirname, "..", "assets/images/background.png"),
        "base64"
      );
      const titleImageAsBase64 = fs.readFileSync(
        path.join(__dirname, "..", "assets/images/titleBG.png"),
        "base64"
      );
      
      let head = `
        <style type="text/css">
            .page{position: relative;z-index: 1;} 
            .chapter{} 
            .content-title{} 
            .content{} 
            .page-break{page-break-before: always;}
            .category{font-weight: 100;margin-top: 100px;text-align: center;position: relative;}
            .title-page {font-size: 62px;font-weight: bold;margin-top: 40%;text-align: center;position: relative;}
            .type{margin-top: 26%;font-weight: 100;text-align: center;position: relative;}
        </style>
        <img style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;" src="data:image/png;base64,${titleImageAsBase64}" />
      `;

      const { Configuration, OpenAIApi } = require("openai");
      const configuration = new Configuration({
        apiKey,
      });
      const openai = new OpenAIApi(configuration);
      let model = "gpt-3.5-turbo";

      let translated = ''
      let content = `
        <h1 class='category'>${collection.category}</h1>
        <div class='title-page'>${collection.title}</div>
        <h2 class='type'>${collection.type}</h2>
        <div class='page'>
      `;
    
      let prompt = `Please translate the following html contents in ${lang_label}.\n `;
      prompt += `The html contents as following:\n `;
      prompt += content;

      try {
        const response = await openai.createChatCompletion({
          model,
          messages: [{ role: "system", content: prompt }],
          temperature: 0.7,
        });

        translated = response.data.choices[0].message.content
      } catch(e) {
        console.log(e)
        return res.json({result: 'failed'})
      }

      for (let i = 0; i < collection.editors.length; i++) {
        prompt = `Please translate the following html contents in ${lang_label}.\n`;
        prompt += `The html contents as following:\n`;

        if (collection.editors[i].type === "chapter") {
          prompt += `<div class='page-break'></div><h1 class='chapter'>${collection.editors[i].content}</h1>`;
        } else {
          prompt += `<h2 class='content-title'>${collection.editors[i].title}</h2><div class='content'>${collection.editors[i].content}</div>`;
        }

        try {
          const response = await openai.createChatCompletion({
            model,
            messages: [{ role: "system", content: prompt }],
            temperature: 0.7,
          });

          translated += response.data.choices[0].message.content

          console.log(`==================Num ${i}================`)
        } catch(e) {
          console.log(e)
          return res.json({result: 'failed'})
        }
      }

      translated += "</div>";

      console.log('=================TRANSLATED++++++++++++++')
      try {
        content = head + translated

        const pdfBuffer = await html_to_pdf.generatePdf({ content }, options);
        const pdfInfo = await pdf(pdfBuffer);
        const numPages = pdfInfo.numpages;
      
        for (let i = 1; i < numPages; i++) {
          content += `<img style="position: absolute;top: ${
            i * 2049 - i * 154
          };left: 0;width: 100%;z-index: 0;" src="data:image/png;base64,${imageAsBase64}" />`;
        }
        let file = { content };
        await html_to_pdf.generatePdf(file, options);
        return res.json({ result: "success", path: `${collection._id}_${lang_val}.pdf` });

      } catch (e) {
        console.log({ e });
        return res.json({ result: "failed" });
      }

    }
  })
}

exports.generatePDF = async (req, res) => {
  const {
    title,
    contentType,
    category,
    language,
    collection_id,
    editors,
  } = req.body;

  let options = {
    width: 1537,
    height: 2049,
    margin: {
      top: 77,
      right: 72,
      bottom: 77,
      left: 72,
    },
    printBackground: true,
    path: path.join(__dirname, "..", `assets/generated/pdf/${collection_id}_${language}.pdf`),
  };

  const imageAsBase64 = fs.readFileSync(
    path.join(__dirname, "..", "assets/images/background.png"),
    "base64"
  );
  const titleImageAsBase64 = fs.readFileSync(
    path.join(__dirname, "..", "assets/images/titleBG.png"),
    "base64"
  );
  let content = `<style type="text/css">
        .page{position: relative;z-index: 1;} 
        .chapter{} 
        .content-title{} 
        .content{} 
        .page-break{page-break-before: always;}
        .hrm{font-weight: 100;margin-top: 100px;text-align: center;position: relative;}
        .title-page {font-size: 62px;font-weight: bold;margin-top: 40%;text-align: center;position: relative;}
        .type{margin-top: 26%;font-weight: 100;text-align: center;position: relative;}
    </style>
    <img style="position: absolute;top: 0;left: 0;width: 100%;z-index: 0;" src="data:image/png;base64,${titleImageAsBase64}" />
    <h1 class="hrm">${category}</h1>
    <div class="title-page">${title}</div>
    <h2 class="type">${contentType}</h2>
    <div class="page">`;

  for (let i = 0; i < editors.length; i++) {
    if (editors[i].type === "chapter") {
      content += `<div class="page-break"></div>`;
      content += `<h1 class="chapter">${editors[i].content}</h1>`;
    } else {
      content += `<h2 class="content-title">${editors[i].title}</h2>`;
      content += `<div class="content">${editors[i].content}</div>`;
    }
  }
  content += "</div>";

  const pdfBuffer = await html_to_pdf.generatePdf({ content }, options);
  const pdfInfo = await pdf(pdfBuffer);
  const numPages = pdfInfo.numpages;

  for (let i = 1; i < numPages; i++) {
    content += `<img style="position: absolute;top: ${
      i * 2049 - i * 154
    };left: 0;width: 100%;z-index: 0;" src="data:image/png;base64,${imageAsBase64}" />`;
  }
  let file = { content };
  const result = await html_to_pdf.generatePdf(file, options);
  return res.json({ result: "success", path: `${collection_id}_${language}.pdf` });
};

exports.generateTemplate = async (req, res) => {
  const { title, description, category, language } = req.body;
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  // const prompt1 = `generate a list of chapters and subchapters for a book titled ${title} in json format. the description of this book is: ${description}\n do not include any explanation or code formatting. format it in this way: "+"{\"chapter_name\":[\"subchapter_names\"],}"+". please include between 5 and 10 subchapters per chapter. use this format exactly.`;
  let prompt = `Generate the Outline for the chapters, sections of the book "${title}".\n`;
  prompt += `The description of the book is: ${description}.\n`;
  prompt += `The book is a kind of ${category}.\n`;
  prompt += `The language is ${language}\n`;
  prompt += "Please generate more than one chapters and every chapter contains enough sections.\n";
  prompt += "Don't sections contain any content. Please give only title.\n"
  prompt += "The result should be formatted as follows:\n";
  prompt += "//#**#//\n";
  prompt += "/#)(#/Chapter's title\n";
  prompt += "\t/#][#/Section's title\n";
 
  let model = "gpt-3.5-turbo";
  let messages = [{ role: "system", content: prompt }];
  try {

    const response = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.3,
    });

    res.json({ result: response.data.choices[0].message.content });
  } catch (e) {
    console.log({ e });
    res.json({ result: "failed" });
  }
};

exports.generateContent = async (req, res) => {
  const {
    title,
    description,
    category,
    language,
    chapter,
    section,
    subsection,
  } = req.body;
  
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  let prompt = `The book's name is "${title}".\n`;
  prompt += `The description of the book is "${description}"\n\n`;
  prompt += `The category of the book is: ${category}\n`;
  prompt += `The language is ${language}\n`;
  prompt += `Please write down the content of section ${section} for the chapter ${chapter}.\n`;
  prompt += `The content must absolutely contains enough text!\n`;
  prompt += `The result of content should be formatted as following:\n`;
  prompt += `content text\n`;
  
  let model = "gpt-3.5-turbo";
  let messages = [{ role: "system", content: prompt }];
  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.3,
    });
    res.json({ result: response.data.choices[0].message.content });
  } catch (e) {
    console.log({ e });
    res.json({ result: "failed" });
  }
};

exports.generatePart = async (req, res) => {
  const { title, description, category, language, part } = req.body;
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  let prompt = `The book's name is "${title}".\n`;
  prompt += `The description of the book is "${description}"\n\n`;
  prompt += `The category of the book is: ${category}\n`;
  prompt += `The language is ${language}\n`;
  prompt += `Write the content for the following part of the book:\n`;
  prompt += `-${part}\n`;
  prompt += `The text must absolutely contain at least 1000 words !\n`;

  let model = "gpt-3.5-turbo";
  let messages = [{ role: "system", content: prompt }];
  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.3,
    });
    res.json({ result: response.data.choices[0].message.content });
  } catch (e) {
    console.log({ e });
    res.json({ result: "failed" });
  }
};

exports.generateTitle = async (req, res) => {
  const { text } = req.body
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  let prompt = `Please write down a ${text} related book title.\n`;

  let model = "gpt-3.5-turbo";
  let messages = [{ role: "system", content: prompt }];
  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.3,
    });
    res.json({ result: response.data.choices[0].message.content });
  } catch (e) {
    console.log({ e });
    res.json({ result: "failed" });
  }
}

exports.generateIntroduction = async(req, res) => {
  const { text, topic } = req.body
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  let prompt = `Please write down a ${topic} related book introduction like ${text}.\n`;

  let model = "gpt-3.5-turbo";
  let messages = [{ role: "system", content: prompt }];
  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.3,
    });
    res.json({ result: response.data.choices[0].message.content });
  } catch (e) {
    console.log({ e });
    res.json({ result: "failed" });
  }
}

exports.generateDescription = async(req, res) => {
  const { text, topic } = req.body
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  let prompt = `Please write down a short ${topic} related book description like ${text}.\n`;

  let model = "gpt-3.5-turbo";
  let messages = [{ role: "system", content: prompt }];
  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
      temperature: 0.3,
    });
    res.json({ result: response.data.choices[0].message.content });
  } catch (e) {
    console.log({ e });
    res.json({ result: "failed" });
  }
}
