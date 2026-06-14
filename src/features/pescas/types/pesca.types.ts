import { peixe } from "../../../database/schemas/peixeSchema";
import { IPeixe } from "../../../interfaces/Peixe";

export type Pesca = typeof peixe.$inferSelect;
export type NewPesca = typeof peixe.$inferInsert;
export type UpdatePesca = Partial<Omit<NewPesca, "id">>;

export type PescaFormData = Omit<
    IPeixe,
    "ativo" | "createdBy" | "status" | "hChegadaSalgadeira"
>;

export type PescaFormField = keyof PescaFormData;

export type PescaFormErrors = Partial<Record<PescaFormField, string>>;

export type PescaFormValidationResult =
    | { success: true; data: PescaFormData }
    | { success: false; errors: PescaFormErrors };

export type LacreValidationState =
    | { status: "idle" }
    | { status: "invalid"; message: string }
    | { status: "checking" }
    | { status: "available"; message: string }
    | { status: "duplicate"; message: string }
    | { status: "error"; message: string };

export type RegistrarPescaResult =
    | { success: true; pesca: Pesca | null }
    | { success: false; message: string; error: Error };
