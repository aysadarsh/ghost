export interface Dic {
  [key: string]: any
}

export interface paramOption {
  pagination: Boolean
  limit: number
  page: number
  offset: number
  sort: string | string[]
  sortBy: string | string[]
  search: string
  filter: string
  filterBy: string
}

export const pass = ({ status }: { status: number }) => {
  const success = [200, 201, 202, 203, 204, 205]
  if (success.indexOf(status) >= 0) {
    return true
  }

  return false
}

export const pageOption: serverOption = {
  pagination: true,
  limit: 10,
  page: 1,
  offset: 0,
  sort: 'desc',
  sortBy: '_id',
  search: '',
  filter: null,
  filterBy: null
}

export const themeColor = '#5d87ff'

export const apiUrl = 'http://localhost:8002/api'
