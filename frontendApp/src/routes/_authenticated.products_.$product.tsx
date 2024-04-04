/* eslint-disable @typescript-eslint/no-explicit-any */
import { editProduct, getProduct, getProductHistory } from '@/api/products'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SVGProps, useState } from 'react'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { addMeasurement, getMeasurements } from '@/api/measurements'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const Route = createFileRoute('/_authenticated/products/$product')({
  component: ProductComponent,
})

interface Data {
  id: string
  code: string
  name: string
  category: string
  hasStock: boolean
  updateAt: Date
}
interface MeasurmentData {
  id: string
  name: string
  value: string
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 500))

function ProductComponent() {
  const { product } = Route.useParams()

  const {
    data: productData,
    isLoading: isLoadingProductData,
    error: errorProductData,
  } = useQuery(['product', product], () => getProduct(product))

  const {
    data: productHistoryData,
    isLoading: isLoadingProductHistoryData,
    error: errorProductHistoryData,
  } = useQuery(['historyProduct', product], () => getProductHistory(product))

  const {
    data: productMeasurementsData,
    isLoading: isLoadingProductMeasurementsData,
    error: errorProductMeasurementsData,
  } = useQuery(['productMeasurements', product], () =>
    getMeasurements(Number(product))
  )

  if (
    isLoadingProductData ||
    isLoadingProductHistoryData ||
    isLoadingProductMeasurementsData
  )
    return <div>Loading Product Data...</div>
  if (
    errorProductData ||
    errorProductHistoryData ||
    errorProductMeasurementsData
  )
    return <div>Error Product Data</div>

  const editButton = <Button size="sm">Edit</Button>
  const addButton = <Button size="sm">Add Measurement</Button>
  return (
    <>
      <>
        <Card>
          <CardHeader>
            <CardTitle>{productData.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Code</Label>
                <div>{productData.code}</div>
              </div>

              <div>
                <Label>Category</Label>
                <div>{productData.category}</div>
              </div>
              <div>
                <Label>Has Stock</Label>
                <div>{productData.hasStock ? 'True' : 'False'}</div>
              </div>
              <div>
                <Label>Update at</Label>
                <div>
                  {new Date(productData.updateAt).toLocaleString('es-EC')}
                </div>
              </div>
            </div>
            <div>
              <Label>Measurements</Label>

              <div className="grid grid-cols-2 gap-4">
                {productMeasurementsData.map((measurement: MeasurmentData) => (
                  <div key={measurement.id}>
                    {measurement.name}: {measurement.value}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end gap-2">
              {/* <Button size="sm">Edit</Button> */}
              <DialogEditProduct
                trigger={editButton}
                id={product}
                categoryProduct={productData.category}
                name={productData.name}
                code={productData.code}
                stock={productData.hasStock}
              />
              <DialogAddMeasurement id={product} trigger={addButton} />
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <table className="w-full min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 font-normal text-left">Code</th>
                    <th className="p-2 font-normal text-left">Name</th>
                    <th className="p-2 font-normal text-left">Category</th>
                    <th className="p-2 font-normal text-left">Has Stock</th>
                    <th className="p-2 font-normal text-left">Update at</th>
                  </tr>
                </thead>
                <tbody>
                  {productHistoryData.map((history: Data) => (
                    <tr key={history.id}>
                      <td className="p-2">{history.code}</td>
                      <td className="p-2">{history.name}</td>
                      <td className="p-2">{history.category}</td>
                      <td className="p-2">
                        {history.hasStock ? 'true' : 'false'}
                      </td>
                      <td className="p-2">
                        {new Date(history.updateAt).toLocaleString('es-EC')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </>
    </>
  )
}
function DialogEditProduct({
  trigger,
  id,
  categoryProduct,
  name,
  code,
  stock,
}: {
  trigger: any
  id: string
  categoryProduct: string
  name: string
  code: string
  stock: boolean
}) {
  const { mutate, isLoading } = useMutation(editProduct)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(categoryProduct)
  const [hasStock, setHasStock] = useState(stock)
  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }
  const handleStockChange = (value: string) => {
    setHasStock(value === 'In Stock')
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const name = event.target.elements.name.value
    const code = event.target.elements.code.value

    mutate(
      { id, name, code, hasStock, category },
      {
        onSuccess: () => {
          toast.success('Product update!')
          queryClient.invalidateQueries(['product'])
          queryClient.invalidateQueries(['historyProduct'])
          wait().then(() => setOpen(false))
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" defaultValue={name} />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input id="code" defaultValue={code} className="col-span-3" />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label className="text-right">Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-[50px] md:w-[100px] lg:w-[100px] xl:w-[150px] justify-between flex"
                    id="category"
                    size="sm"
                    variant="outline"
                  >
                    {category}
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={category}
                    onValueChange={handleCategoryChange}
                  >
                    <DropdownMenuRadioItem value="Electronics">
                      Electronics
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Clothing">
                      Clothing
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Home">
                      Home
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Groceries">
                      Groceries
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Sports">
                      Sports
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label className="text-right">Stock</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-[50px] md:w-[100px] lg:w-[100px] xl:w-[150px] justify-between flex"
                    id="hasStock"
                    size="sm"
                    variant="outline"
                  >
                    {hasStock ? 'In Stock' : 'Out of Stock'}
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={hasStock}
                    onCheckedChange={() => handleStockChange('In Stock')}
                  >
                    In Stock
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={!hasStock}
                    onCheckedChange={() => handleStockChange('Out of Stock')}
                  >
                    Out of Stock
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <DialogFooter>
            {isLoading ? (
              'Loading...'
            ) : (
              <Button type="submit">Save changes</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, 'User cannot be empty'),
  value: z
    .string({
      required_error: 'Value is required',
    })
    .min(1, 'Value cannot be empty'),
})

function DialogAddMeasurement({ trigger, id }: { trigger: any; id: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      value: '',
    },
  })
  const { mutate, isLoading } = useMutation(addMeasurement)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const name = values.name
    const value = values.value

    mutate(
      { productId: Number(id), name, value },
      {
        onSuccess: () => {
          toast.success('¡Measurement added!')
          queryClient.invalidateQueries(['productMeasurements'])
          wait().then(() => setOpen(false))
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
              } else {
                toast.error(`Error ${serverError.response.status}`)
              }
            }
          }
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add measurements</DialogTitle>
          <DialogDescription>
            Add measurements to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-center space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Value" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? 'Loading...' : <Button type="submit">Save</Button>}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function ChevronDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
