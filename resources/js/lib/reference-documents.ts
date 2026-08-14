export type ReferenceDocumentStatus = 'active' | 'inactive' | 'expired';

export interface ReferenceDocument {
    id: number;
    reference_id: string;
    reference_link: string;
    principal_name: string;
    document_number: string;
    program_name: string;
    category_name: string;
    status: ReferenceDocumentStatus;
    expired_date: string;
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
