/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

export const getProducts = async (): Promise<any> => {
  const { data } = await axios.get('http://localhost:5000/api/products')
  return data
}

interface SearchProduct {
  name: string
  category: string
  hasStock: boolean
}
interface EditProduct {
  id: string
  name: string
  category: string
  hasStock: boolean
  code: string
}

export const searchProducts = async (search: SearchProduct) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/products/search?name=${search.name}&category=${search.category}&hasStock=${search.hasStock}`
  )
  return data
}

export const getProduct = async (id: string) => {
  const { data } = await axios.get(`http://localhost:5000/api/products/${id}`)

  return data
}

export const getProductHistory = async (id: string) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/products/${id}/history`
  )

  return data
}

export const editProduct = async (data: EditProduct) => {
  await axios.put('http://localhost:5000/api/products/', data)
}
