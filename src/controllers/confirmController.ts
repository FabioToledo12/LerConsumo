import type { Request, Response } from "express";
import { measures } from "./uploadController";

export const confirmMeasure = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { measure_uuid, correct_value } = req.body;

  // Verifica se o UUID fornecido
  if (!measure_uuid) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Missing measure_uuid",
    });
  }

  // Verifica se a medição UUID fornecido existe
  const measure = measures[measure_uuid];
  if (!measure) {
    return res.status(404).json({
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Measure not found",
    });
  }

  // Verifica se a medição está confirmada
  if (measure.confirmed) {
    return res.status(400).json({
      error_code: "ALREADY_CONFIRMED",
      error_description: "This measure has already been confirmed",
    });
  }

  if (correct_value) {
    measure.measure_value = correct_value;
  }

  // Confirma a medição
  measure.confirmed = true;

  return res.status(200).json({
    message: "Measure confirmed successfully",
    measure_uuid,
    measure_value: measure.measure_value,
  });
};
