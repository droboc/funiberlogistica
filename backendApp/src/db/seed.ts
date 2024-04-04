import { db } from '.'

import { categories, products, users } from './schema'

export const seed = async () => {
  const USER = 'user'
  const PASSWORD = 'password'

  await db.insert(users).values({
    id: 1,
    user: USER,
    password: PASSWORD,
  })

  await db.insert(categories).values({
    id: 1,
    name: 'Electronics',
  })
  await db.insert(categories).values({
    id: 2,
    name: 'Clothing',
  })
  await db.insert(categories).values({
    id: 3,
    name: 'Home',
  })
  await db.insert(categories).values({
    id: 4,
    name: 'Groceries',
  })
  await db.insert(categories).values({
    id: 5,
    name: 'Sports',
  })

  await db.insert(products).values({
    code: '001',
    name: 'iPhone 15',
    categoryId: 1,
  })

  await db.insert(products).values({
    code: '002',
    name: 'Cotton T-shirt',
    categoryId: 2,
  })

  await db.insert(products).values({
    code: '003',
    name: 'Kitchen Knife Set',
    categoryId: 3,
  })

  await db.insert(products).values({
    code: '004',
    name: 'Wholegrain Rice Pack',
    categoryId: 4,
  })

  await db.insert(products).values({
    code: '005',
    name: 'Soccer Ball',
    categoryId: 5,
  })

  await db.insert(products).values({
    code: '006',
    name: 'Smartwatch',
    categoryId: 1,
  })

  await db.insert(products).values({
    code: '007',
    name: 'Leather Jacket',
    categoryId: 2,
  })

  await db.insert(products).values({
    code: '008',
    name: 'Bedding Set',
    categoryId: 3,
  })

  await db.insert(products).values({
    code: '009',
    name: 'Organic Milk',
    categoryId: 4,
  })

  await db.insert(products).values({
    code: '010',
    name: 'Yoga Mat',
    categoryId: 5,
  })
  await db.insert(products).values({
    code: '011',
    name: 'Laptop',
    categoryId: 1,
  })

  await db.insert(products).values({
    code: '012',
    name: 'Denim Jeans',
    categoryId: 2,
  })

  await db.insert(products).values({
    code: '013',
    name: 'Curtain Set',
    categoryId: 3,
  })

  await db.insert(products).values({
    code: '014',
    name: 'Fresh Vegetables Basket',
    categoryId: 4,
  })

  await db.insert(products).values({
    code: '015',
    name: 'Basketball',
    categoryId: 5,
  })
}
