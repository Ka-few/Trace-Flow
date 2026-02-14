

export type TransferStatus = 'Pending' | 'Completed' | 'Cancelled' | 'Rejected';

export interface TransferDto {
    id: string;
    batchId: string;
    batchPublicToken: string;
    sourceOrganizationId: string;
    sourceOrganizationName: string;
    destinationOrganizationId: string;
    destinationOrganizationName: string;
    quantity: number;
    unitOfMeasure: string;
    status: TransferStatus;
    initiatedAt: string;
    completedAt?: string;
    notes?: string;
}

export interface InitiateTransferCommand {
    batchId: string;
    destinationOrganizationId: string;
    notes?: string;
}

export interface AcceptTransferCommand {
    transferId: string;
    destinationSiteId: string;
}

export interface CancelTransferCommand {
    transferId: string;
    reason?: string;
}
