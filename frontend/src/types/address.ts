export type Address = {
  id: string
  label: string
  zipCode: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  isPrimary: boolean
}

export type AddressDraft = Omit<Address, 'id' | 'isPrimary'>

export const emptyAddressDraft: AddressDraft = {
  label: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
}
