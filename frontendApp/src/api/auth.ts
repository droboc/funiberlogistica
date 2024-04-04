/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios'

interface LoginParams {
  user: string
  password: string
}

export const login = async ({ user, password }: LoginParams): Promise<any> => {
  for (let i = 0; i < 3; i++) {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        {
          user,
          password,
        }
      )
      return data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.code === 'EAI_AGAIN') {
        if (i < 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        } else {
          throw axiosError
        }
      } else {
        throw axiosError
      }
    }
  }
}
