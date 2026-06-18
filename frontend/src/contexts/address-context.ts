import { createContext } from 'react'
import type { Address, AddressDraft } from '../types/address'

export type AddressContextData = {
  addresses: Address[]
  primaryAddress: Address | null
  addAddress: (address: AddressDraft & { isPrimary?: boolean }) => Address
  removeAddress: (addressId: string) => void
  setPrimaryAddress: (addressId: string) => void
  updateAddress: (addressId: string, address: AddressDraft) => void
}

export const AddressContext = createContext<AddressContextData>({} as AddressContextData)
