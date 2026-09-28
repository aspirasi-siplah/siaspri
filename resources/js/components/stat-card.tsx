export default function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </h3>
                </div>

                <div className="rounded-2xl bg-sky-100 p-3 text-sky-800">
                    {icon}
                </div>
            </div>
        </div>
    );
}
