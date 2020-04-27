const expect = require("chai").expect;
const env = require("dotenv").config();
const fetch = require("node-fetch");

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  const Google_API_Key = process.env.Google_API_Key;
  const CX = process.env.CX;
  const url = "https://www.googleapis.com/customsearch/v1?";

  app.route("/api/search/:input").get((req, res) => {
    let input = encodeURI(req.params.input);
    let offset = req.query.offset;

    console.log(input);

    let urlGoogleApi =
      url +
      "key=" +
      Google_API_Key +
      "&cx=" +
      CX +
      "&q=" +
      input +
      "&searchType=image&num=" +
      offset;
    fetch(urlGoogleApi)
      .then((data) => data.json())
      .catch((err) => console.log(err))
      .then((data) => {
        if (data.hasOwnProperty("error")) {
          res.json({ message: "Error image search" });
        } else {
          MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
            if (err) console.log(err);

            db.collection("BrowseSearch").insertOne(
              {
                term: req.params.input,
                when: new Date(),
              },
              (err, docs) => {
                if (err) console.log("Error Browse Search");

                console.log(docs.ops[0]);

                db.close();
              }
            );
          });
          let result = [];
          result = data.items.map((item) => {
            return {
              url: item.link,
              snippet: item.snippet,
              thumbnail: item.image.thumbnailLink,
              context: item.image.contextLink,
            };
          });
          res.json(result);
        }
      });
  });

  app.route("/api/latest/imagesearch/").get((req, res) => {
    MongoClient.connect(MONGODB_CONNECTION_STRING, (err, db) => {
      if (err) console.log(err);

      db.collection("BrowseSearch")
        .find({}, { term: 1, when: 1 })
        .limit(10)
        .sort({ when: -1 })
        .toArray((err, docs) => {
          if (err) console.log("Error get data");

          if (docs !== null && docs !== undefined && docs.length > 0) {
            res.json(docs);
          } else {
            res.json({ message: "No browse search" });
          }
          db.close();
        });
    });
  });
};
