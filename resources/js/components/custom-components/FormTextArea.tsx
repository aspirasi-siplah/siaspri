interface Props {
    label: string;
    name: string;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    error?: string;
    info?: string;
    [key: string]: any;
}

export default function FormTextArea({
    label,
    name,
    rows,
    placeholder,
    required,
    error,
    info,
    ...Props
}: Props) {
    return (
        <div className="flex w-full flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
                {label}{' '}
                {required && (
                    <span className="text-[13px] text-red-500">*</span>
                )}
            </label>

            <textarea
                name={name}
                placeholder={placeholder}
                required={required}
                rows={rows}
                {...Props}
                className="no-spinner rounded-lg border border-gray-200 bg-white px-3 py-2 scheme-light placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
            {info && !error && (
                <span className="text-xs text-gray-500">{info}</span>
            )}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
