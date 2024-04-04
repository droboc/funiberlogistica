import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table'
import { SVGProps, SetStateAction, useState } from 'react'
import { JSX } from 'react/jsx-runtime'
import { useQuery } from 'react-query'
import { getProducts, searchProducts } from '@/api/products'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/products')({
  component: Products,
})

interface Data {
  id: string
  code: string
  name: string
  category: string
  hasStock: boolean
  updateAt: Date
}

function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [hasStock, setHasStock] = useState(true)

  const { data, isLoading } = useQuery(
    ['data', searchTerm, category, hasStock],
    () =>
      searchTerm.trim() !== '' || category !== '' || hasStock !== true
        ? searchProducts({
            name: searchTerm,
            category: category,
            hasStock: hasStock,
          })
        : getProducts(),
    {
      enabled: true,
    }
  )

  const handleSearch = (event: {
    target: { value: SetStateAction<string> }
  }) => {
    setSearchTerm(event.target.value)
  }
  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }

  const handleStockChange = (value: string) => {
    setHasStock(value === 'In Stock')
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-4 border-b">
        <div className="container py-4">
          <div className="grid gap-2 md:grid-cols-[200px_1fr]">
            <div className="flex items-center gap-4">
              <PackageIcon className="w-6 h-6" />
              <h1 className="text-2xl font-semibold">Products</h1>
            </div>
            <div className="flex items-center gap-4">
              <form className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px]"
                  placeholder="Search products..."
                  type="search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </form>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-[100px] md:w-[200px] lg:w-[200px] xl:w-[300px] justify-between flex"
                    id="category"
                    size="sm"
                    variant="outline"
                  >
                    {category === '' ? 'All Categories' : category}
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={category}
                    onValueChange={handleCategoryChange}
                  >
                    <DropdownMenuRadioItem value="">
                      All Categories
                    </DropdownMenuRadioItem>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-[100px] md:w-[200px] lg:w-[200px] xl:w-[300px] justify-between flex"
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
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid gap-6">
          <div className="border rounded-lg shadow-sm">
            {isLoading ? (
              <div>Loading</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Has Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((product: Data) => (
                    <TableRow
                      className=" hover:bg-gray-100 dark:hover:bg-gray-800"
                      key={product.code}
                    >
                      <TableCell>{product.code}</TableCell>
                      <TableCell className="font-semibold">
                        <Link
                          to="/products/$product"
                          params={{ product: product.id }}
                          className="text-blue-900 underline cursor-pointer"
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.hasStock ? 'true' : 'false'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
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

function PackageIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
