export type ReferenceDocumentStatus = 'active' | 'inactive' | 'expired';

export interface ReferenceDocument {
    id: number;
    reference_id: string;
    reference_link: string;
    principal_name: string;
    company_name: string;
    document_number: string;
    file_name: string | null;
    file_path: string | null;
    program_name: string | null;
    category_name: string | null;
    status: ReferenceDocumentStatus;
    expired_date: string | null;
    created_at?: string;
}

export const statusOptions: {
    label: string;
    value: ReferenceDocumentStatus;
}[] = [
    { label: 'Aktif', value: 'active' },
    { label: 'Nonaktif', value: 'inactive' },
    { label: 'Kedaluwarsa', value: 'expired' },
];

export const statusConfig: Record<
    ReferenceDocumentStatus,
    { label: string; color: string }
> = {
    active: { label: 'Aktif', color: 'bg-green-100 text-green-700' },
    inactive: { label: 'Nonaktif', color: 'bg-gray-100 text-gray-700' },
    expired: { label: 'Kedaluwarsa', color: 'bg-red-100 text-red-700' },
};
