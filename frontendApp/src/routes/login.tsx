/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/storage/auth'
import { login } from '../api/auth'
import { useMutation } from 'react-query'
import axios, { AxiosError } from 'axios'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/login')({
  component: Login,
})

const formSchema = z.object({
  user: z
    .string({
      required_error: 'User is required',
    })
    .min(1, 'User cannot be empty'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1, 'Password cannot be empty'),
})

function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: '',
      password: '',
    },
  })
  const navigate = useNavigate()

  const setUser = useAuthStore((state) => state.setUser)
  const toggleAuth = useAuthStore((state) => state.toggleAuth)
  const isAuth = useAuthStore((state) => state.isAuth)

  const { mutate, isLoading } = useMutation(login)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      { user: values.user, password: values.password },
      {
        onSuccess: (data) => {
          setUser(data)
          toggleAuth()
          navigate({ to: '/products' })
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError<any>
            if (serverError && serverError.response) {
              if (
                typeof serverError.response.data === 'object' &&
                'message' in serverError.response.data
              ) {
                toast.error(
                  `Error ${serverError.response.status}: ${(serverError.response.data as { message: string }).message}`
                )
              }
            }
          }
        },
      }
    )
  }

  const handleLogout = () => {
    toggleAuth()
    setUser('')
  }

  return (
    <>
      <div className="flex min-h-[350px] w-full justify-center p-10 items-center">
        {isLoading && <div>Loading...</div>}
        {!isAuth && !isLoading && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-center space-y-4"
            >
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Input placeholder="User" {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Login</Button>
            </form>
          </Form>
        )}{' '}
        {isAuth && (
          <Button onClick={handleLogout}>Logout</Button> // Muestra el botón de logout si está autenticado
        )}
      </div>
    </>
  )
}
