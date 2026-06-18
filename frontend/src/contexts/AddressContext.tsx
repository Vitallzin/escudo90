import { useState, type ReactNode } from 'react'
import type { Address, AddressDraft } from '../types/address'
import { AddressContext } from './address-context'

const ADDRESS_STORAGE_KEY = 'escudo90:addresses'

function readStoredAddresses(): Address[] {
  try {
    const storedAddresses = localStorage.getItem(ADDRESS_STORAGE_KEY)

    if (!storedAddresses) {
      return []
    }

    const parsedAddresses = JSON.parse(storedAddresses) as Address[]

    if (!Array.isArray(parsedAddresses)) {
      localStorage.removeItem(ADDRESS_STORAGE_KEY)
      return []
    }

    return parsedAddresses.filter((address) => address.id && address.street && address.city)
  } catch {
    localStorage.removeItem(ADDRESS_STORAGE_KEY)
    return []
  }
}

function createAddressId() {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeAddress(address: AddressDraft) {
  return {
    label: address.label.trim() || 'Entrega',
    zipCode: address.zipCode.trim(),
    street: address.street.trim(),
    number: address.number.trim(),
    complement: address.complement?.trim() ?? '',
    district: address.district.trim(),
    city: address.city.trim(),
    state: address.state.trim().toUpperCase().slice(0, 2),
  }
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>(() => readStoredAddresses())

  function commit(nextAddresses: Address[]) {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(nextAddresses))
    setAddresses(nextAddresses)
  }

  function addAddress(address: AddressDraft & { isPrimary?: boolean }) {
    const isFirstAddress = addresses.length === 0
    const shouldBePrimary = isFirstAddress || !!address.isPrimary
    const nextAddress: Address = {
      ...normalizeAddress(address),
      id: createAddressId(),
      isPrimary: shouldBePrimary,
    }

    const nextAddresses = [
      ...addresses.map((currentAddress) =>
        shouldBePrimary ? { ...currentAddress, isPrimary: false } : currentAddress
      ),
      nextAddress,
    ]

    commit(nextAddresses)
    return nextAddress
  }

  function updateAddress(addressId: string, address: AddressDraft) {
    commit(
      addresses.map((currentAddress) =>
        currentAddress.id === addressId
          ? { ...currentAddress, ...normalizeAddress(address) }
          : currentAddress
      )
    )
  }

  function setPrimaryAddress(addressId: string) {
    commit(
      addresses.map((address) => ({
        ...address,
        isPrimary: address.id === addressId,
      }))
    )
  }

  function removeAddress(addressId: string) {
    const addressToRemove = addresses.find((address) => address.id === addressId)
    const remainingAddresses = addresses.filter((address) => address.id !== addressId)

    if (addressToRemove?.isPrimary && remainingAddresses[0]) {
      remainingAddresses[0] = { ...remainingAddresses[0], isPrimary: true }
    }

    commit(remainingAddresses)
  }

  const primaryAddress = addresses.find((address) => address.isPrimary) ?? addresses[0] ?? null

  return (
    <AddressContext
      value={{
        addresses,
        primaryAddress,
        addAddress,
        removeAddress,
        setPrimaryAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext>
  )
}
