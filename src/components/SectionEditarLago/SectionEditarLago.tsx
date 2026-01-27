import { useState } from "react";
import { ILago } from "../../interfaces/Lago";
import FormLago from "../FormLago/FormLago";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FlatList } from "react-native";
import CardLago from "../CardLago/CardLago";

interface Props {
    lagos: ILago[];
    editar: (id: number, dados: Partial<ILago>) => void;
    excluir: (id: number) => void;
    refetch: () => void;
}

export default function SectionEditarLago({ lagos, editar, excluir, refetch }: Props) {
    const [selectedLago, setSelectedLago] = useState<ILago | null>(null);

    const handleEditarLago = async (dados: Partial<ILago>) => {
        if (selectedLago?.id != null) {
            editar(selectedLago.id, dados);
            setSelectedLago(null);
            refetch();
        }
    }

    return (
        <>
            {selectedLago ?
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    enableOnAndroid
                >
                    <FormLago
                        lago={selectedLago}
                        onSubmit={handleEditarLago}
                    />
                </KeyboardAwareScrollView>
                :
                <FlatList
                    data={lagos}
                    keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                    renderItem={({ item }) => (
                        <CardLago
                            lago={item}
                            editar={setSelectedLago}
                            excluir={excluir}
                        />
                    )}
                />
            }
        </>
    )
}