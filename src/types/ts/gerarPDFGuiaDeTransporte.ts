import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { IPeixe } from '../Peixe';

interface Props {
    peixes: IPeixe[];
    lote: ILote;
}

export async function gerarEPDFDownloadExpo({ peixes, lote }: Props): Promise<void> {
    try {
        // Gerar as linhas da tabela dinamicamente
        const tableRows = peixes.map(peixe => `
            <tr>
                <td>${peixe.especie}</td>
                <td>${peixe.lacre}</td>
                <td>1</td>
                <td>${peixe.cat}</td>
                <td>${peixe.comprimento}</td>
                <td>${peixe.peso}</td>
                <td>${peixe.sexo}</td>
                <td>${peixe.gona}</td>
            </tr>
        `).join('');

        // Definir o HTML com estilos embutidos e as linhas geradas
        const htmlContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Helvetica, Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #fff;
                    color: #333;
                    font-size: 12px;
                }

                h1 {
                    text-align: center;
                    color: #1a73e8;
                }

                h3 {
                    text-align: center;
                }

                p {
                    font-size: 12px;
                    line-height: 1.6;
                    text-align: justify;
                }

                .container {
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                    max-width: 900px;
                    margin: auto;
                }

                .highlight {
                    font-weight: bold;
                    color: #d32f2f;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                    font-size: 10px;
                }

                th {
                    background-color: #1a73e8;
                    color: white;
                    font-size: 11px;
                }

                .horizontal {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .horizontal h3, .horizontal span {
                    margin: 0;
                }

                span {
                    font-weight: 400;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <section>
                    <h1>FUNDAÇÃO AMAZÔNIA SUSTENTÁVEL</h1>
                    <h1>COORDENAÇÃO TÉCNICA FAS</h1>
                    <h1>PLANILHA DE CONTROLE E MONITORAMENTO</h1>
                </section>

                <section>
                    <div class="horizontal">
                        <h3>Assistente: <span>${lote.assistente}</span></h3>
                    </div>

                    <div class="horizontal">
                        <h3>Comunidade: <span>${lote.comunidade}</span></h3>
                        <h3>Setor: <span>${lote.setor}</span></h3>
                        <h3>Barco: <span>${lote.barco}</span></h3>
                        <h3>Data: <span>${ new Date(lote.data).toLocaleDateString('pt-BR')}</span></h3>
                    </div>

                    <div class="horizontal">
                        <h3>Fêmeas: <span>${lote.quantidadeF}</span> <br> Machos: <span>${lote.quantidadeM}</span></h3>
                        <h3>Quantidade total: <span>${lote.quantidade}</span></h3>
                        <h3>Peso total: <span>${lote.pesoTotal} kg</span></h3>
                    </div>
                </section>
                
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
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `;

        // Gerar o PDF
        const { uri } = await Print.printToFileAsync({ html: htmlContent, width: 600, height: 800 });

        console.log(`PDF criado em: ${uri}`);

        // Renomear o arquivo, se necessário
        const novoUri = `${FileSystem.documentDirectory}relatorioPescas.pdf`;
        await FileSystem.moveAsync({
            from: uri,
            to: novoUri,
        });

        // Verificar se o compartilhamento é possível e compartilhar o arquivo
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(novoUri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Baixar PDF',
                UTI: 'com.adobe.pdf',
            });
        } else {
            Alert.alert("Erro", "Compartilhamento não disponível neste dispositivo.");
        }
    } catch (error) {
        console.error('Erro ao gerar ou compartilhar o PDF:', error);
        Alert.alert("Erro", "Não foi possível gerar ou compartilhar o PDF.");
    }
}
