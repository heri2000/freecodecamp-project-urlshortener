require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: String
});

var UrlModel = mongoose.model("url_short", urlSchema);

const createAndSaveUrl = (url, done) => {
  if (!isValidURL(url)) {
    done("invalid url");
  } else {

    var shortUrl = 1;

    UrlModel.find()
      .sort({ short_url: -1 })
      .limit(1)
      .select({ original_url: 0 })
      .exec((err, result) => {

        if (err) return console.log(err);

        if (result.length > 0) shortUrl = Number(result[0].short_url) + 1;
        
        let data = {
          original_url: url,
          short_url: shortUrl
        };

        var urlObject = new UrlModel(data);

        urlObject.save((err, urlData) => {
          if (err) return console.error(err);
          done(null, data);
        });

      });

  }

};

function isValidURL(value) {
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regexp = new RegExp(expression);
  return regexp.test(value);
}


const findOneByShortUrl = (shortUrl, done) => {
  if (isNaN(shortUrl)) {
    done("URL not found");
  } else {
    UrlModel.findOne({ short_url: shortUrl }, (err, data) => {
      if (err) return console.log(err);
      try {
        done(null, data.original_url);
      } catch (err) {
        done("URL not found");
      }
    });
  }
}


exports.UrlModel = UrlModel;
exports.createAndSaveUrl = createAndSaveUrl;
exports.findOneByShortUrl = findOneByShortUrl;