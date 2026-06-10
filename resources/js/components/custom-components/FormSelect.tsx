interface Props {
    label: string;
    name: string;
    options: { label: string; value: string | number }[];
    required?: boolean;
    error?: string;
    [key: string]: any;
}

export default function FormSelect({ label, name, options, required, error, notes, ...Props }: Props) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-600">{label} {required && <span className="text-red-500 text-[13px]">*</span>}</label>

            <select
                name={name}
                required={required}
                className="h-11 rounded-lg text-sm bg-white border border-gray-200 px-3 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 custom-scrollbar"
                {...Props}
            >
                <option value="">-- Pilih {label} --</option>

                {options?.length > 0 ?
                options?.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))
                :
                <option value="">Tidak ada data {label}</option>
                }
            </select>
            {notes && <span className="text-xs text-gray-500">{notes}</span>}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
