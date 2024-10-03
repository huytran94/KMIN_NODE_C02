import path from "path";
import fs from "fs";
const extractFileType = (fileName) => {
  return fileName.split(".").filter(Boolean).slice(1).join(".");
};

const readFile = (fileName = "", ...pathSegments) => {
  try {
    pathSegments = ["src", ...pathSegments];
    let filePath = path.resolve(...pathSegments, fileName);
    let fileData = fs.readFileSync(filePath);
    if (extractFileType(fileName) === "json") {
      fileData = JSON.parse(fileData);
    }

    return fileData;
  } catch (error) {
    throw error;
  }
};

const writeFile = (fileName = "", newFileData = {}, ...pathSegments) => {
  try {
    if (Object.keys(newFileData).length === 0) {
      throw new Error("File data must not be empty");
    }
    let filePath = path.resolve(...pathSegments, fileName);
    if (extractFileType(fileName) === "json") {
      newFileData = JSON.stringify(newFileData);
    }
    fs.writeFileSync(filePath, newFileData);
  } catch (error) {
    throw error;
  }
};

export { readFile, writeFile };
