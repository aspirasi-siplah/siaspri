export default function Footer() {
    return (
        <footer className="border-t bg-white">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div>
                        <h3 className="text-lg font-bold">AspirasiKu</h3>

                        <p className="text-slate-500">
                            Wadah aspirasi digital yang transparan dan
                            terpercaya.
                        </p>
                    </div>

                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} AspirasiKu
                    </p>
                </div>
            </div>
        </footer>
    );
}