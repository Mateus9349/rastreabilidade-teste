import { useState } from "react";
import { IComunidade } from "../../interfaces/Comunidade"
import { FlatList, KeyboardAvoidingView, Text } from "react-native";
import CardComunidade from "../CardComunidade/CardComunidade";
import FormComunidade from "../FormComunidade/FormComunidade";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
    comunidades: IComunidade[];
    editar: (id: number, dados: Partial<IComunidade>) => void;
    excluir: (id: number) => void;
    refetch: () => void;
}

export default function SectionEditarComunidade({ comunidades, editar, excluir, refetch }: Props) {
    const [selectedComunidade, setSelectedComunidade] = useState<IComunidade | null>(null);

    const handleEditarComunidade = async (dados: Partial<IComunidade>) => {
        if (selectedComunidade?.id != null) {
            editar(selectedComunidade.id, dados);
            setSelectedComunidade(null);
            refetch();
        }
    }

    return (
        <>
            {selectedComunidade ?
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    enableOnAndroid
                >
                    <FormComunidade
                        comunidade={selectedComunidade}
                        onSubmit={handleEditarComunidade}
                    />
                </KeyboardAwareScrollView>
                :
                <FlatList
                    data={comunidades}
                    keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                    renderItem={({ item }) => (
                        <CardComunidade
                            comunidade={item}
                            editar={setSelectedComunidade}
                            excluir={excluir}
                        />
                    )}
                />
            }
        </>
    )
}