import { Request, Response } from "express";
import Measurement from "../models/Measurement";

const confirmController = async (req: Request, res: Response) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    if (!measure_uuid || !confirmed_value) {
      return res.status(400).json({
        error: "INVALID_DATA",
        message: "Os dados fornecidos no corpo da requisição são inválidos.",
      });
    }

    const measure = await Measurement.findOne({
      where: { measureUuid: measure_uuid },
    });

    if (!measure) {
      return res.status(404).json({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Medição não encontrada.",
      });
    }

    if (measure.hasConfirmed) {
      return res.status(409).json({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada",
      });
    } else {
      measure.hasConfirmed = true;
      measure.measureValue = confirmed_value;
      await measure.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao confirmar o pedido:", error);
    res.status(500).json({ error: "Ocorreu um erro ao confirmar o pedido." });
  }
};

export { confirmController };
