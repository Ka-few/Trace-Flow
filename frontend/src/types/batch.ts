export type BatchStatus =
    | 'Created'
    | 'ReadyForTransfer'
    | 'InTransit'
    | 'Received'
    | 'Processing'
    | 'Processed'
    | 'Sold'
    | 'Recalled'
    | 'Closed';

export interface BatchDto {
    id: string;
    organizationId: string;
    siteId?: string;
    siteName?: string;
    publicToken: string;
    productType: string;
    strainOrVariety?: string;
    quantity: number;
    unitOfMeasure: string;
    status: BatchStatus;
    harvestDate: string;
    processDate?: string;
    createdAt: string;
}

export interface BatchListDto {
    id: string;
    publicToken: string;
    productType: string;
    quantity: number;
    unitOfMeasure: string;
    status: BatchStatus;
    siteName?: string;
    harvestDate: string;
}

export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface BatchSplitDefinition {
    quantity: number;
    productType?: string;
    strainOrVariety?: string;
}

export interface SplitBatchCommand {
    sourceBatchId: string;
    splits: BatchSplitDefinition[];
}
