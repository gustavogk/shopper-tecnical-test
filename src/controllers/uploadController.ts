import dotenv from "dotenv";
import { Request, Response } from "express";
import { saveImageToFile } from "../functions/save-image";
import path from "path";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import Measurement from "../models/Measurement";
import { isValidDateTime } from "../functions/valid-datetime";
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const uploadController = async (req: Request, res: Response) => {
  const { image, costumer_code, measure_datetime, measure_type } = req.body;

  if (!costumer_code || !measure_datetime || !measure_type || !image) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description:
        "Os dados fornecidos no corpo da requisição são inválidos",
    });
  }

  if (measure_type !== "GAS" && measure_type !== "WATER") {
    return res.status(400).json({
      error_code: "INVALID_MEASURE_TYPE",
      error_description: "O campo 'measure_type' deve ser 'GAS' ou 'WATER'",
    });
  }

  if (!isValidDateTime(measure_datetime)) {
    return res.status(400).json({
      error_code: "INVALID_DATETIME_FORMAT",
      error_description:
        "O formato do campo 'measure_datetime' é inválido. Esperado: 'YYYY-MM-DDTHH:MM:SSZ'",
    });
  }

  const date = new Date(measure_datetime);

  if (isNaN(date.getTime())) {
    return res.status(400).json({
      error_code: "INVALID_DATETIME",
      error_description:
        "O campo 'measure_datetime' não representa uma data válida.",
    });
  }

  if (!geminiApiKey) {
    console.error("GEMINI API KEY NOT FOUND");
    return res.status(500).json({
      error_code: "INVALID_DATA",
      error_description: "GEMINI API KEY NOT FOUND",
    });
  }

  try {
    const imageDir = path.join(__dirname, "../../public/images");
    const imageName = `${Date.now()}.png`;
    const imagePath = saveImageToFile(image, imageDir, imageName);

    const prompt =
      "Analyze the provided image and extract the numerical reading from the meter, ignoring any leading zeros. Return the reading as a single numeric value.";
    const imageToGenerate = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
        mimeType: "image/png",
      },
    };

    const result = await model.generateContent([prompt, imageToGenerate]);

    const measure_uuid = uuidv4();

    const measureAlreadyExists = await Measurement.findOne({
      where: {
        customerCode: costumer_code,
        measureType: measure_type,
        measureDatetime: date,
      },
    });

    if (measureAlreadyExists) {
      return res.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      });
    }

    const measure = await Measurement.create({
      customerCode: costumer_code,
      imageUrl: imagePath,
      measureValue: Number(result.response.text()),
      measureType: measure_type,
      measureDatetime: date,
      hasConfirmed: false,
      measureUuid: measure_uuid,
    });

    return res.status(200).json({
      image_url: imagePath,
      measure_value: result.response.text(),
      measure_uuid: measure_uuid,
    });
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    return res.status(500).send({ error });
  }
};

export { uploadController };
