import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalCreateComunidades } from "../hooks/LocalData/comunidade/useLocalCreateComunidade";
import { useLocalComunidades } from "../hooks/LocalData/comunidade/useLocalComunidades";
import BotaoLink from "../components/BotaoLink/BotaoLink";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FormComunidade from "../components/FormComunidade/FormComunidade";
import SectionEditarComunidade from "../components/SectionEditarComunidade/SectionEditarComunidade";
import { useLocalUpdateComunidade } from "../hooks/LocalData/comunidade/useLocalUpdateComunidade";
import { useLocalDeleteComunidade } from "../hooks/LocalData/comunidade/useLocalDeleteComunidade";
import { IComunidade } from "../interfaces/Comunidade";

export default function Comunidades() {
    const [menu, setMenu] = useState<' ' | 'add' | 'edit'>(' ');

    const { createComunidade } = useLocalCreateComunidades();
    const { comunidades, listarComunidades } = useLocalComunidades();
    const { updateComunidade } = useLocalUpdateComunidade();
    const { deleteComunidade } = useLocalDeleteComunidade();

    const handleCriarComunidade = async(comunidade: IComunidade) => {
        await createComunidade(comunidade);
        listarComunidades();
    }

    const handleExcluir = async(id: number) => {
        await deleteComunidade(id);
        listarComunidades();
    }

    return (
        <View style={{ padding: 16, minHeight: '100%', justifyContent: 'space-between'  }}>
            {menu === 'add' &&
                <FormComunidade
                    onSubmit={handleCriarComunidade}
                />
            }

            {menu === 'edit' &&
                <View style={{ maxHeight: '70%' }} >
                    <SectionEditarComunidade
                        comunidades={comunidades}
                        editar={updateComunidade}
                        excluir={handleExcluir}
                        refetch={listarComunidades}
                    />
                </View>
            }

            <View
                style={{
                    flexDirection: 'row',
                    gap: 15,
                    justifyContent: 'center',
                    alignContent: 'flex-end',
                    marginTop: 25,
                }}
            >
                <BotaoLink
                    title="Criar comunidade"
                    text="Adicione uma comunidade ao sistema"
                    onPress={() => setMenu('add')}
                >
                    <MaterialCommunityIcons name="home-group-plus" size={34} color="white" />
                </BotaoLink>

                <BotaoLink
                    title="Editar comunidade"
                    text="Edite as informações da comunidade no sistema"
                    onPress={() => setMenu('edit')}
                >
                    <MaterialCommunityIcons name="home-group-remove" size={34} color="white" />
                </BotaoLink>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    titulo: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 8,
        borderRadius: 4,
    },
    item: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    nome: { fontWeight: "bold" },
    coords: { color: "#555" },
});