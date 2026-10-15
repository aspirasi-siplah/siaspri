import { Check, ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Option {
    label: string;
    value: string | number;
}

interface Props {
    name?: string;
    label?: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    info?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    limit?: number;
    className?: string;
    icon?: React.ReactNode;
}

export default function Combobox({
    name,
    label,
    options,
    value,
    onChange,
    placeholder = 'Pilih...',
    searchPlaceholder = 'Cari...',
    emptyText = 'Tidak ada data',
    info,
    error,
    required,
    disabled,
    limit = 5,
    className = '',
    icon,
}: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlight, setHighlight] = useState(0);
    const [rect, setRect] = useState<{
        top: number;
        left: number;
        width: number;
        bottom: number;
    } | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selected = options.find((option) => String(option.value) === value);

    const filtered = useMemo(() => {
        const keyword = query.trim().toLowerCase();

        if (keyword) {
            return options.filter((option) =>
                option.label.toLowerCase().includes(keyword),
            );
        }

        return options.slice(0, limit);
    }, [options, query, limit]);

    const isFiltering = query.trim().length > 0;
    const hasMore = !isFiltering && options.length > limit;

    const updateRect = () => {
        if (!triggerRef.current) {
            return;
        }

        const bounds = triggerRef.current.getBoundingClientRect();

        setRect({
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            bottom: bounds.bottom,
        });
    };

    const handleOpen = () => {
        if (disabled) {
            return;
        }

        updateRect();
        setQuery('');
        setHighlight(0);
        setOpen(true);
    };

    const selectOption = (optionValue: string) => {
        onChange(optionValue);
        setOpen(false);
        setQuery('');
    };

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (triggerRef.current?.contains(target)) {
                return;
            }

            if (dropdownRef.current?.contains(target)) {
                return;
            }

            setOpen(false);
        };

        const handleReposition = () => updateRect();

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleReposition);
        document.addEventListener('scroll', handleReposition, true);

        const timeout = setTimeout(() => searchRef.current?.focus(), 0);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleReposition);
            document.removeEventListener('scroll', handleReposition, true);
            clearTimeout(timeout);
        };
    }, [open]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlight((current) =>
                Math.min(current + 1, filtered.length - 1),
            );
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlight((current) => Math.max(current - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();

            const option = filtered[highlight];

            if (option) {
                selectOption(String(option.value));
            }
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    let dropdownStyle: React.CSSProperties | undefined;

    if (rect) {
        const dropdownMaxHeight = 300;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < dropdownMaxHeight && rect.top > spaceBelow;

        dropdownStyle = openUp
            ? {
                  position: 'fixed',
                  left: rect.left,
                  width: rect.width,
                  bottom: window.innerHeight - rect.top + 4,
                  zIndex: 60,
              }
            : {
                  position: 'fixed',
                  left: rect.left,
                  width: rect.width,
                  top: rect.bottom + 4,
                  zIndex: 60,
              };
    }

    return (
        <div className={`flex w-full flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-600">
                    {label}{' '}
                    {required && (
                        <span className="text-[13px] text-red-500">*</span>
                    )}
                </label>
            )}

            <button
                type="button"
                ref={triggerRef}
                name={name}
                disabled={disabled}
                onClick={() => (open ? setOpen(false) : handleOpen())}
                className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left text-sm transition focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${
                    error
                        ? 'border-red-300'
                        : 'border-gray-200 focus:border-blue-500'
                } ${open ? 'border-blue-500' : ''}`}
            >
                <span className="flex min-w-0 items-center gap-2">
                    {icon && (
                        <span className="shrink-0 text-gray-400">{icon}</span>
                    )}
                    <span
                        className={`truncate ${
                            selected ? 'text-gray-800' : 'text-gray-400'
                        }`}
                    >
                        {selected ? selected.label : placeholder}
                    </span>
                </span>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-gray-400 transition ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {info && !error && (
                <span className="text-xs text-gray-500">{info}</span>
            )}
            {error && <span className="text-xs text-red-500">{error}</span>}

            {open &&
                rect &&
                dropdownStyle &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={dropdownStyle}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                    >
                        <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2.5">
                            <Search
                                size={15}
                                className="shrink-0 text-gray-400"
                            />
                            <input
                                ref={searchRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setHighlight(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={searchPlaceholder}
                                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                            />
                        </div>
                        <div className="max-h-64 overflow-y-auto py-1">
                            {filtered.length ? (
                                filtered.map((option, index) => {
                                    const isSelected =
                                        String(option.value) === value;
                                    const isHighlighted = index === highlight;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onMouseEnter={() =>
                                                setHighlight(index)
                                            }
                                            onClick={() =>
                                                selectOption(
                                                    String(option.value),
                                                )
                                            }
                                            className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm ${
                                                isHighlighted
                                                    ? 'bg-blue-50'
                                                    : ''
                                            }`}
                                        >
                                            <span
                                                className={`truncate ${
                                                    isSelected
                                                        ? 'font-medium text-blue-700'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                {option.label}
                                            </span>
                                            {isSelected && (
                                                <Check
                                                    size={15}
                                                    className="shrink-0 text-blue-600"
                                                />
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="px-3 py-6 text-center text-sm text-gray-400">
                                    {emptyText}
                                </p>
                            )}
                        </div>
                        {hasMore && (
                            <div className="border-t border-gray-100 px-3 py-2 text-center text-xs text-gray-400">
                                Menampilkan {limit} dari {options.length}{' '}
                                program. Ketik untuk mencari.
                            </div>
                        )}
                    </div>,
                    document.body,
                )}
        </div>
    );
}
