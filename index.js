const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplates');
const slugify = require("slugify");
////////////////////////////////////////////////////////FILES//////////////////////////////////
// Sync Way (Blocking)
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avacodo : ${textIn}. \n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written");

// ASync Way (Non Blocking)

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) {
//     return console.log(" Error Detected");
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         if (err) throw err;
//         console.log("Your File has been written.");
//       });
//     });
//   });
// });
// console.log("Will read File!!");

////////////////////////////////////////////SERVER////////////////////////////////////////////////
//Fetching Data
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
//creating Server
const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url,true);
  // Overview
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    response.end(output);

    // Products
  } else if (pathname === "/product") {
    response.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct,product);
    response.end(output);

    //API
  } else if (pathname === "/api") {
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(data);

    //PAGE NOT FOUND
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-Own-Header": "Sushain's Error",
    });
    response.end("<h1>Invalid URL! PAGE NOT FOUND!</h1>");
  }
});

//Initializing Server

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
