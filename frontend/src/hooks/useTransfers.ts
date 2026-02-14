import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/client'
import type { TransferDto, InitiateTransferCommand, AcceptTransferCommand, CancelTransferCommand } from '../types/transfer'

export const useTransfers = (params: { status?: string } = {}) => {
    return useQuery({
        queryKey: ['transfers', params],
        queryFn: async () => {
            const { data } = await api.get<TransferDto[]>('/transfers', { params })
            return data
        }
    })
}

export const useInitiateTransfer = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (command: InitiateTransferCommand) => {
            const { data } = await api.post('/transfers', command)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers'] })
            queryClient.invalidateQueries({ queryKey: ['batches'] })
        }
    })
}

export const useAcceptTransfer = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ transferId, ...command }: AcceptTransferCommand) => {
            const { data } = await api.post(`/transfers/${transferId}/accept`, command)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers'] })
            queryClient.invalidateQueries({ queryKey: ['batches'] })
        }
    })
}

export const useCancelTransfer = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ transferId, ...command }: CancelTransferCommand) => {
            const { data } = await api.post(`/transfers/${transferId}/cancel`, command)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers'] })
            queryClient.invalidateQueries({ queryKey: ['batches'] })
        }
    })
}
