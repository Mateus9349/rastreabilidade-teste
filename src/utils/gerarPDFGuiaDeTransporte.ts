import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { IPeixe } from "../interfaces/Peixe";
import { ILote } from "../interfaces/Lote";

interface Props {
  peixes: IPeixe[];
  lote: ILote;
}

export async function gerarEPDFDownloadExpo({ peixes, lote }: Props): Promise<void> {
  try {
    // --- Helpers ---
    function chunk<T>(arr: T[], size: number) {
      const out: T[][] = [];
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
      return out;
    }

    function renderRows(rowsPeixes: IPeixe[]) {
      return rowsPeixes
        .map(
          (p) => `
          <tr>
            <td>${p.especie ?? ""}</td>
            <td>${p.lacre ?? ""}</td>
            <td>1</td>
            <td>${p.cat ?? ""}</td>
            <td>${p.comprimento ?? ""}</td>
            <td>${p.peso ?? ""}</td>
            <td>${p.sexo ?? ""}</td>
            <td>${p.gona ?? ""}</td>
          </tr>
        `
        )
        .join("");
    }

    const dataBR = new Date(lote.data).toLocaleDateString("pt-BR");

    function renderPage(rowsPeixes: IPeixe[], pageIndex: number) {
      const rowsHtml = renderRows(rowsPeixes);
      const showPageBreak = pageIndex > 0 ? 'style="page-break-before: always;"' : "";

      return `
        <section class="section" ${showPageBreak}>
          <div class="header">
            <h2>FUNDAÇÃO AMAZÔNIA SUSTENTÁVEL</h2>
            <h3>COORDENAÇÃO TÉCNICA FAS</h3>
            <h3>PLANILHA DE CONTROLE E MONITORAMENTO</h3>
          </div>

          <div class="meta">
            <div><b>Assistente:</b> ${lote.assistente ?? ""}</div>
            <div><b>Destino:</b> ${lote.comunidade ?? ""}</div>
            <div><b>Setor:</b> ${lote.setor ?? ""}</div>
            <div><b>Barco:</b> ${lote.barco ?? ""}</div>
            <div><b>Data:</b> ${dataBR}</div>
          </div>

          <div class="meta">
            <div><b>Fêmeas:</b> ${lote.quantidadeF ?? 0}</div>
            <div><b>Machos:</b> ${lote.quantidadeM ?? 0}</div>
            <div><b>Quantidade total:</b> ${lote.quantidade ?? peixes.length}</div>
            <div><b>Peso total:</b> ${typeof lote.pesoTotal === "string" ? lote.pesoTotal : (lote.pesoTotal ?? "")} kg</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Esp.</th>
                <th>Lacre</th>
                <th>Qtid.</th>
                <th>Cat</th>
                <th>CT(cm)</th>
                <th>Peso(kg)</th>
                <th>Sexo</th>
                <th>Est. Gona</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </section>
      `;
    }

    // --- Paginando em blocos de 40 linhas ---
    const chunks = chunk(peixes, 40);
    const pagesHtml = chunks.map((grupo, idx) => renderPage(grupo, idx)).join("");

    // --- HTML final (uma única vez) ---
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 16mm 12mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #222;
              font-size: 11px;
            }
            h1, h2, h3 { margin: 0 0 6px; }
            .header { text-align: center; margin-bottom: 8px; }
            .meta { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 8px 0 10px; }
            .meta b { font-weight: 600; }

            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            thead { display: table-header-group; } /* repete cabeçalho por página */
            tr { page-break-inside: avoid; }

            th, td {
              border: 1px solid #ddd;
              padding: 4px 6px;
              text-align: left;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 10px;
            }
            th {
              background: #1a73e8;
              color: #fff;
              font-size: 10.5px;
            }

            /* Larguras aproximadas para caber bem */
            th:nth-child(1), td:nth-child(1) { width: 22%; }
            th:nth-child(2), td:nth-child(2) { width: 18%; }
            th:nth-child(3), td:nth-child(3) { width: 8%;  text-align: center; }
            th:nth-child(4), td:nth-child(4) { width: 10%; }
            th:nth-child(5), td:nth-child(5) { width: 12%; }
            th:nth-child(6), td:nth-child(6) { width: 12%; }
            th:nth-child(7), td:nth-child(7) { width: 8%;  text-align: center; }
            th:nth-child(8), td:nth-child(8) { width: 10%; }

            .section { page-break-after: auto; }
          </style>
        </head>
        <body>
          ${pagesHtml}
        </body>
      </html>
    `;

    // --- Gera PDF (sem width/height) ---
    const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });

    // --- Move e compartilha ---
    const novoUri = `${FileSystem.documentDirectory}relatorioPescas.pdf`;
    await FileSystem.moveAsync({ from: uri, to: novoUri });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(novoUri, {
        mimeType: "application/pdf",
        dialogTitle: "Baixar PDF",
        UTI: "com.adobe.pdf",
      });
    } else {
      Alert.alert("Concluído", "PDF salvo em: " + novoUri);
    }
  } catch (error) {
    console.error("Erro ao gerar ou compartilhar o PDF:", error);
    Alert.alert("Erro", "Não foi possível gerar ou compartilhar o PDF.");
  }
}