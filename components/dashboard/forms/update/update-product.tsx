'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import slugify from 'slugify'

import { nanoid } from 'nanoid'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { SaveAllIcon, XIcon, SparklesIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { UploadDropzone } from '@/utils/upload/uploadthing'

import { tryCatch } from '@/hooks/use-try-catch'

import { productSchema, ProductSchemaType } from '@/schemas/dashboard/product'
import { ProductStatus, ProductTag } from '@/lib/generated/prisma'
import { updateProductAction } from '@/server/actions/dashboard/product'

const BlockNoteEditor = dynamic(() => import('@/components/tools/blocknote-editor'), {
  ssr: false,
})

interface WarehouseOption {
  id: string
  name: string
}

interface BrandOption {
  id: string
  name: string
}

interface CategoryOption {
  id: string
  name: string
}

interface PromotionOption {
  id: string
  label: string
}

interface UpdateProductFormProps {
  product: ProductSchemaType & { id: string }
  warehouses: WarehouseOption[]
  brands: BrandOption[]
  categories: CategoryOption[]
  promotions: PromotionOption[]
}

// sku generator using first letters of a product
const generateShortSku = (productName: string): string => {
  if (typeof productName !== 'string' || productName.trim() === '') {
    return ''
  }

  const initials = productName
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  const uniqueId = nanoid(4).toUpperCase()

  return `${initials}-${uniqueId}`
}

const UpdateProductForm = ({
  product,
  warehouses,
  brands,
  categories,
  promotions,
}: UpdateProductFormProps) => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  //   block note states
  //   call server action to submit form
  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      warehouseId: product.warehouseId,
      brandId: product.brandId,
      categoryId: product.categoryId,
      promotionId: product.promotionId || null,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      productVariant: product.productVariant || undefined,
      productVariantValue: product.productVariantValue || undefined,
      description: product.description,
      features: product.features,
      specifications: product.specifications || undefined,
      content: product.content || undefined,
      images: product.images,
      tag: product.tag as ProductSchemaType['tag'],
      status: product.status as ProductSchemaType['status'],
    },
  })

  function onSubmit(values: ProductSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateProductAction(values, product.id))

      if (error) {
        toast.error('Unexpected error occurred. Please try again.')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        router.push('/dashboard/products')
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="warehouseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warehouse</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a warehouse" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {warehouses.length === 0 ? (
                    <SelectItem value="" disabled>
                      No warehouses found
                    </SelectItem>
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Warehouses</SelectLabel>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.length === 0 ? (
                    <SelectItem value="" disabled>
                      No brands found
                    </SelectItem>
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Brands</SelectLabel>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.length === 0 ? (
                    <SelectItem value="" disabled>
                      No categories found
                    </SelectItem>
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="promotionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promotion</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(val === 'none' ? undefined : val)}
                value={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a promotion (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">No Promotion</SelectItem>
                    {promotions.map((promotion) => (
                      <SelectItem key={promotion.id} value={promotion.id}>
                        {promotion.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end space-x-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => {
              const slug = slugify(form.getValues('name'))
              form.setValue('slug', slug, { shouldValidate: true })
            }}
          >
            Generate Slug <SparklesIcon className="ml-1 size-4" />
          </Button>
        </div>

        <div className="flex items-end space-x-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="SKU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => {
              const productName = form.getValues('name')
              const newSku = generateShortSku(productName)
              form.setValue('sku', newSku, { shouldValidate: true })
            }}
          >
            Generate SKU <SparklesIcon className="ml-1 size-4" />
          </Button>
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 19.99"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 10"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productVariant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productVariantValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant Value</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Red" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <BlockNoteEditor initialContent={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <BlockNoteEditor initialContent={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specifications</FormLabel>
              <BlockNoteEditor initialContent={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <BlockNoteEditor initialContent={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              {field.value?.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {field.value.map((url, i) => (
                    <div key={url} className="relative w-fit">
                      <Image
                        src={url}
                        alt={`Image ${i + 1}`}
                        width={200}
                        height={200}
                        unoptimized
                        className="rounded-md border object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full"
                        onClick={() =>
                          field.onChange(field.value.filter((_, index) => index !== i))
                        }
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <UploadDropzone
                endpoint="productImageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res.map((file) => file.url)
                  field.onChange([...(field.value || []), ...urls])
                  toast.success('Images uploaded successfully!')
                }}
                onUploadError={() => {
                  toast.error('Something went wrong. Please try again.')
                }}
                className="ut-button:rounded-full ut-button:bg-ultramarine-700 ut-allowed-content:text-muted-foreground mt-4"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(ProductTag).map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(ProductStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Please wait...
            </>
          ) : (
            <>
              <SaveAllIcon />
              Update Product
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateProductForm
