
type HeaderAlign = 'text-left' | 'text-center' | 'text-right';

interface Props {
    title: string;
    icon?: any;
    header: string[];
    headerAlign: HeaderAlign[];
    children: any
}

export default function CustomTable({
    title,
    icon,
    header,
    headerAlign,
    children
} : Props) {
    return (
        <div className="overflow-hidden rounded-2xl border bg-card">
            <div className="border-b p-5">
                <div className="flex items-center gap-3">
                    {icon}
                    <h2 className="font-semibold text-gray-900">{title}</h2>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            {header.map((item, index) => (
                                <th
                                    className={`p-4 text-sm text-gray-700 ${
                                        headerAlign[index]
                                    }`}
                                >
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}