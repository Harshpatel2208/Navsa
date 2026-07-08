const fs = require("fs");
const path = require("path");

const folder = "./public/brands";

const files = fs.readdirSync(folder);

const brands = files.map(file => {
  const name = file.replace(/\.[^/.]+$/, ""); // remove extension
  return {
    name: name,
    file: file
  };
});

fs.writeFileSync(
  "./public/brands-list.json",
  JSON.stringify(brands, null, 2)
);

console.log("Brands JSON generated!");