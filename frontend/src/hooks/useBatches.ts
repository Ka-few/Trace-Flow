import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import type { BatchListDto, PagedResult } from '../types/batch'

export const useBatches = (params: {
    organizationId?: string,
    status?: string,
    pageNumber?: number,
    pageSize?: number
}) => {
    return useQuery({
        queryKey: ['batches', params],
        queryFn: async () => {
            const { data } = await api.get<PagedResult<BatchListDto>>('/batches', { params })
            return data
        }
    })
}

export const useBatch = (id: string) => {
    return useQuery({
        queryKey: ['batch', id],
        queryFn: async () => {
            const { data } = await api.get(`/batches/${id}`)
            return data
        },
        enabled: !!id
    })
}
