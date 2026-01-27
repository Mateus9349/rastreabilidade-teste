// hooks/lote/useEnviarLoteCompleto.ts
import { useState } from "react";
import { Alert } from "react-native";
import type { ILote } from "../../interfaces/Lote";
import type { IPeixe } from "../../interfaces/Peixe";
import { PeixeService } from "../../services/PeixeService";
import { LoteService } from "../../services/LoteService";
import type { IPeixeDTO, Sexo, StatusItem, ISODateTimeString } from "../../interfaces/DTO/Peixe.DTO";

// ----------------- Helpers -----------------
const toISO = (v: Date | string | undefined | null): ISODateTimeString => {
  if (!v) return new Date().toISOString();
  if (v instanceof Date) return v.toISOString();
  const d = new Date(v);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

const toNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === "number") return v;
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
};

const toSexo: (s?: string) => Sexo = (s) => {
  const v = (s ?? "").trim().toLowerCase();
  return v.startsWith("f") ? "Fêmea" : "Macho";
};

const toStatus: (s?: string) => StatusItem = (s) => {
  const v = (s ?? "").toUpperCase();
  return v === "APPROVED" || v === "REJECTED" ? (v as StatusItem) : "PENDING";
};

const normalizeAnyToArray = (input: unknown): unknown[] => {
  if (Array.isArray(input)) return input;
  if (input == null) return [];
  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return [];
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const arr = JSON.parse(s);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    }
    if (s.includes(",")) return s.split(",").map((x) => x.trim()).filter(Boolean);
    return [s];
  }
  return [input];
};

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

// --------------- Tipos do Hook ---------------
export type ResolvePeixeByLacre = (lacre: string | number) => Promise<IPeixe | null>;

type LoteOnlyCreateDTO = {
  planilha: number;
  comunidade: string;
  setor: string;
  assistente: string;
  barco: string;
  data: ISODateTimeString;
  apetrechos: string;
  ambiente: string;
  quantidade: number;
  quantidadeF: number;
  quantidadeM: number;
  pesoTotal: number;
  peixes: number[];              // <- OBRIGATÓRIO: [] na criação do lote
  ativo: 0 | 1;
  recebidoSalgadeira: boolean;
  createdBy: string;
  comunidadeId?: number;
};

type UseEnviarLoteCompletoOptions = {
  createdBy?: string;
  chunkSize?: number; // default 50
  defaultsPeixe?: Partial<Pick<IPeixeDTO, "especie" | "cat" | "unidade" | "gona" | "status" | "lago" | "comunidade">>;
  resolvePeixeByLacre?: ResolvePeixeByLacre;
};

// --------------- Mapear para IPeixeDTO ---------------
function mapToPeixeDTO(
  item: unknown,
  loteId: number,
  createdBy: string,
  defaults: UseEnviarLoteCompletoOptions["defaultsPeixe"],
  resolved?: IPeixe | null
): IPeixeDTO | null {
  const base = resolved ?? (typeof item === "object" && item ? (item as IPeixe) : undefined);

  const rawLacre = base?.lacre ?? item;
  const lacreNum = toNumber(rawLacre, NaN);
  if (!Number.isFinite(lacreNum)) return null;

  return {
    especie: base?.especie ?? defaults?.especie ?? "Pirarucu",
    cat: base?.cat ?? defaults?.cat ?? "",
    lacre: lacreNum,
    loteId,
    sexo: toSexo(base?.sexo),
    unidade: base?.unidade ?? defaults?.unidade ?? "1",
    gona: base?.gona ?? defaults?.gona ?? "",
    comprimento: base?.comprimento ?? "",
    peso: base?.peso ?? "",
    hPesca: toISO(base?.hPesca),
    lago: base?.lago ?? defaults?.lago ?? "",
    comunidade: base?.comunidade ?? defaults?.comunidade ?? "",
    hEvisceramento: toISO(base?.hEvisceramento),
    hChegadaSalgadeira: base?.hChegadaSalgadeira ? toISO(base.hChegadaSalgadeira) : "",
    createdBy,
    status: toStatus(base?.status),
  };
}

// --------------- Hook ---------------
export const useEnviarLoteCompleto = (opts?: UseEnviarLoteCompletoOptions) => {
  const [loadingEnviar, setLoadingEnviar] = useState(false);
  const [errorEnviar, setErrorEnviar] = useState<string | null>(null);

  const enviarLoteCompleto = async (
    lote: ILote
  ): Promise<{ loteId: number; enviados: number; total: number }> => {
    setLoadingEnviar(true);
    setErrorEnviar(null);

    try {
      const createdBy = opts?.createdBy ?? "";
      const chunkSize = opts?.chunkSize ?? 50;

      // (1) cria lote com peixes: []
      const loteDTO: LoteOnlyCreateDTO = {
        planilha: toNumber(lote.planilha),
        comunidade: lote.comunidade ?? "",
        setor: lote.setor ?? "",
        assistente: lote.assistente ?? "",
        barco: lote.barco ?? "",
        data: toISO(lote.data),
        apetrechos: lote.apetrechos ?? "",
        ambiente: lote.ambiente ?? "",
        quantidade: toNumber(lote.quantidade),
        quantidadeF: toNumber(lote.quantidadeF),
        quantidadeM: toNumber(lote.quantidadeM),
        pesoTotal: toNumber(lote.pesoTotal),
        peixes: [], // <- importante para evitar undefined.length no backend
        ativo: (lote.ativo ?? 1) === 1 ? 1 : 0,
        recebidoSalgadeira: Boolean(lote.recebidoSalgadeira ?? false),
        createdBy,
        // comunidadeId: 1, // se precisar
      };

      const loteRes = await LoteService.criarLote(loteDTO);

      // compat com diferentes formatos de retorno
      const loteId: number | undefined =
        loteRes?.data?.id ?? loteRes?.id ?? loteRes?.data?.data?.id ?? loteRes?.data?.data?.data?.id;

      if (loteId == null) {
        throw new Error("Não foi possível obter o ID do lote criado.");
      }

      // (2) montar a fila de peixes (a partir de lacres ou objetos)
      const inputPeixes = normalizeAnyToArray((lote as any)?.peixes);
      const expanded = inputPeixes.flatMap((it) => {
        if (typeof it === "string" && it.trim().startsWith("{") && it.trim().endsWith("}")) {
          try { return [JSON.parse(it)]; } catch { return [it]; }
        }
        return [it];
      });

      const payload: IPeixeDTO[] = [];
      for (const item of expanded) {
        let resolved: IPeixe | null = null;
        const seemsOnlyLacre =
          typeof item === "string" ||
          typeof item === "number" ||
          (typeof item === "object" &&
            item != null &&
            (item as any).lacre != null &&
            Object.keys(item as any).length <= 2);

        if (seemsOnlyLacre && opts?.resolvePeixeByLacre) {
          const lacreValue = typeof item === "object" ? (item as any).lacre : item;
          resolved = await opts.resolvePeixeByLacre(String(lacreValue));
        }

        const dto = mapToPeixeDTO(item, loteId, createdBy, opts?.defaultsPeixe, resolved);
        if (dto) payload.push(dto);
      }

      if (!payload.length) {
        Alert.alert("Sucesso", `Lote #${loteId} criado sem peixes.`);
        return { loteId, enviados: 0, total: 0 };
      }

      // (3) Envia em batches usando o endpoint BULK
      const grupos = chunk(payload, chunkSize);
      let enviados = 0;
      const erros: string[] = [];

      for (const grupo of grupos) {
        try {
          await PeixeService.criarPeixesBulk(grupo); // <<<<<< bulk (array)
          enviados += grupo.length;
        } catch (e: any) {
          erros.push(e?.message ?? "Falha ao enviar um grupo de peixes.");
        }
      }

      if (erros.length) {
        Alert.alert(
          "Aviso",
          `Lote #${loteId} criado. Enviados ${enviados}/${payload.length} peixes. Alguns grupos falharam.`
        );
      } else {
        Alert.alert("Sucesso", `Lote #${loteId} criado e ${enviados} peixes enviados.`);
      }

      return { loteId, enviados, total: payload.length };
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erro ao enviar lote/peixes.";
      setErrorEnviar(msg);
      Alert.alert("Erro", msg);
      throw err;
    } finally {
      setLoadingEnviar(false);
    }
  };

  return { enviarLoteCompleto, loadingEnviar, errorEnviar };
};
