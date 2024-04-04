import { createFileRoute, redirect } from '@tanstack/react-router'
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const estadoPersistido = JSON.parse(localStorage.getItem('auth')!)
    let isAuth = estadoPersistido?.state.isAuth
    isAuth = isAuth ? true : false
    if (!isAuth) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})
