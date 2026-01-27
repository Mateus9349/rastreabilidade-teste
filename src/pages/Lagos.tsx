import React, { useState } from "react";
import { View, Text, } from "react-native";
import BotaoLink from "../components/BotaoLink/BotaoLink";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FormLago from "../components/FormLago/FormLago";
import { useLocalCreateLago } from "../hooks/LocalData/lago/useLocalCreateLago";
import SectionEditarLago from "../components/SectionEditarLago/SectionEditarLago";
import { useLocalLagos } from "../hooks/LocalData/lago/useLocalLagos";
import { useLocalUpdateLago } from "../hooks/LocalData/lago/useLocalUpdateLago";
import { useLocalDeleteLago } from "../hooks/LocalData/lago/useLocalDeleteLago";
import { ILago } from "../interfaces/Lago";

export default function Lagos() {
    const [menu, setMenu] = useState<' ' | 'add' | 'edit'>(' ');

    const { createLago } = useLocalCreateLago();
    const { lagos, listarLagos } = useLocalLagos();
    const { updateLago } = useLocalUpdateLago();
    const { deleteLago } = useLocalDeleteLago();

    const handleCriarLago = async (lago: ILago) => {
        await createLago(lago);
        listarLagos();
    }

    const handleExcluir = async (id: number) => {
        await deleteLago(id);
        listarLagos();
    }

    return (
        <View style={{ padding: 16, minHeight: '100%', justifyContent: 'space-between' }}>
            {menu === 'add' &&
                <FormLago
                    onSubmit={handleCriarLago}
                />
            }

            {menu === 'edit' &&
                <View style={{ maxHeight: '70%' }} >
                    <SectionEditarLago
                        lagos={lagos}
                        editar={updateLago}
                        excluir={handleExcluir}
                        refetch={listarLagos}
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
                    title="Criar lago"
                    text="Adicione um novo lago ao sistema"
                    onPress={() => setMenu('add')}
                >
                    <Ionicons name="add-circle" size={34} color="white" />
                </BotaoLink>

                <BotaoLink
                    title="Editar lagos"
                    text="Edite as informações dos lagos no sistema"
                    onPress={() => setMenu('edit')}
                >
                    <MaterialIcons name="edit-square" size={34} color="white" />
                </BotaoLink>
            </View>
        </View >
    )
}