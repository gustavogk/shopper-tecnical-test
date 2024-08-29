import fs from "fs";
import path from "path";

export const saveImageToFile = (
  image: string,
  dir: string,
  fileName: string
): string => {
  const base64Data = image.replace(/^data:image\/png;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const imagePath = path.join(dir, fileName);
  fs.writeFileSync(imagePath, imageBuffer);

  return imagePath;
};
