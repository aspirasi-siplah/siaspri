import { X } from 'lucide-react';

type Option = {
    id: number;
    name: string;
};

type MultiSelectProps = {
    label?: string;
    options: Option[];
    value: number[];
    onChange: (value: number[]) => void;
    error?: string;
};

export default function MultiSelect({
    label,
    options,
    value,
    onChange,
    error,
}: MultiSelectProps) {
    const selectedItems = options.filter((option) =>
        value.includes(option.id),
    );

    const availableItems = options.filter(
        (option) => !value.includes(option.id),
    );

    const handleAdd = (itemId: number) => {
        if (value.includes(itemId)) return;
        onChange([...value, itemId]);
    };

    const handleRemove = (itemId: number) => {
        onChange(value.filter((id) => id !== itemId));
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium">{label}</label>}

            <select
                className="w-full rounded-lg border px-3 text-sm py-2"
                defaultValue=""
                onChange={(e) => {
                    const itemId = parseInt(e.target.value);
                    if (!isNaN(itemId)) {
                        handleAdd(itemId);
                    }
                    e.target.value = '';
                }}
            >
                <option value="">-- {label} --</option>
                {availableItems.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                        >
                            <span>{item.name}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}