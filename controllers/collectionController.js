const Collection = require('../models/Collections')

///// **** ADD EXCEPTION HANDLE ****
exports.collections = async (req, res) => {
  const { page } = req.params
  const chunkSize = 50;

  // Calculate the number of chunks
  Collection.countDocuments({ isPublished: true }, (err, totalCount) => {
    if (err) {
      console.error(err);
      return;
    }

    const totalChunks = Math.ceil(totalCount / chunkSize);
    if(page > totalChunks) {
      return res.json({result: 'failed', totalCount: totalCount})
    }

    const skipCount = (page - 1) * chunkSize;
    Collection.find({ isPublished: true })
      .skip(skipCount)
      .limit(chunkSize)
      .select('_id title type category language')
      .then((records) => {
        return res.json({data: records, totalPage: totalChunks});
      })
      .catch((error) => {
        console.error(error);
      });
  
  });
}

exports.search = async (req, res) => {
  const { term, category, type } = req.body
  

  // Calculate the number of chunks
  Collection.countDocuments({ isPublished: true, title: term, category: category, type: type }, (err, totalCount) => {
    if (err) {
      console.error(err);
      return;
    }

    Collection.find({ isPublished: true, title: term, category: category, type: type })
      .select('_id title type category language')
      .then((records) => {
        return res.json({data: records});
      })
      .catch((error) => {
        console.error(error);
      });
  
  });
}

exports.collection = async (req, res) => {
  const { id } = req.params;
  Collection.findById(id).then( (collection, err) => {
    if(err) {
      console.log(err)
      return res.json({result: 'failed'})
    } else {
      return res.json(collection);
    }
  })
  
};

exports.update = async (req, res) => {
  const { isPublished, listingInfo, category, contentType, language, description, editors, title, id } = req.body;
  const collection = id ? await Collection.findById(id) : new Collection();
  collection.title = title;
  collection.prompt = description;
  collection.editors = editors;
  collection.category = category;
  collection.type = contentType;
  collection.language = language;
  collection.listing_info = listingInfo;
  collection.isPublished = isPublished;
  collection.save().then((record, err) => {
    if(err) {
      console.log(err)
      return res.json({result: 'failed'})
    } else {
      return res.json({ result: "success", id: record._id });
    }
  })
  
}

exports.updatePublishing = async (req, res) => {
  const { id, isPublished } = req.body;
  console.log(id, ':', isPublished)
  Collection.findById(id).then((item, err) => {
    if(err) {
      console.log(err)
      return res.json({result: 'failed'})
    } else {
      item.isPublished = isPublished;
      item.save()
      return res.json({result: 'success'});
    }
  })
}