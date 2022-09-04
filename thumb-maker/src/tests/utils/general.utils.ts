import fs from "fs";
import { get } from "https";

const readFile = (path: string): Promise<any> => {
  return Promise.resolve(fs.readFileSync(path));
};

export { readFile };
