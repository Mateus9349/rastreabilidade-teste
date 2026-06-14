import { IPeixe } from "../../../interfaces/Peixe";
import HorarioInput from "../../../features/pescas/components/HorarioInput";

interface InputHoraProps {
    dados: IPeixe;
    handleDateChange: (field: keyof IPeixe, value: string) => void;
    text: string;
    localArmazenamento: keyof IPeixe;
    errorMessage?: string;
}

export default function InputHora({
    dados,
    handleDateChange,
    text,
    localArmazenamento,
    errorMessage,
}: InputHoraProps) {
    const value = String(dados[localArmazenamento] ?? "");

    return (
        <HorarioInput
            label={text}
            value={value}
            errorMessage={errorMessage}
            onBlur={() => undefined}
            onChange={(nextValue) =>
                handleDateChange(localArmazenamento, nextValue)
            }
        />
    );
}
