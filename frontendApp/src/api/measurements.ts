import axios from 'axios'

interface AddMeasurement {
  name: string
  productId: number
  value: string
}

export const addMeasurement = async (data: AddMeasurement) => {
  await axios.post('http://localhost:5000/api/measurements/', data)
}

export const getMeasurements = async (productId: number) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/measurements/${productId}`
  )
  return data
}
