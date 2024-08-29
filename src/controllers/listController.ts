import { Request, Response } from "express";
import Measurement from "../models/Measurement";

const listController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { measure_type } = req.query;

    let measureTypeFilter = {};
    if (measure_type) {
      const normalizedMeasureType = (measure_type as string).toUpperCase();

      if (
        normalizedMeasureType !== "GAS" &&
        normalizedMeasureType !== "WATER"
      ) {
        return res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida",
        });
      }

      measureTypeFilter = { measureType: normalizedMeasureType };
    }

    const measurements = await Measurement.findAll({
      where: { customerCode: id, ...measureTypeFilter },
    });

    if (measurements.length === 0) {
      return res.status(404).json({
        error_code: "MEASUREMENT_NOT_FOUND",
        error_description: "Nenhuma leitura foi encontrada",
      });
    }

    res.status(200).json({
      customer_code: id.toString(),
      measures: measurements.map((measure) => ({
        measure_uuid: measure.measureUuid,
        measure_datetime: measure.measureDatetime,
        measure_type: measure.measureType,
        has_confirmed: measure.hasConfirmed,
        image_url: measure.imageUrl,
      })),
    });
  } catch (error) {
    console.error("Erro ao listar as medições:", error);
    res.status(500).json({ error: "Ocorreu um erro ao listar as medições." });
  }
};

export { listController };
