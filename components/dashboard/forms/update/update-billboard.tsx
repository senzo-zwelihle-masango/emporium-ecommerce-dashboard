'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { SaveAllIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea'
import { UploadDropzone } from '@/utils/upload/uploadthing'

import { tryCatch } from '@/hooks/use-try-catch'

import { billboardSchema, BillboardSchemaType } from '@/schemas/dashboard/billboard'

import { BillboardStatus } from '@/lib/generated/prisma'
import { updateBillboardAction } from '@/server/actions/dashboard/billboard'

interface CategoryOption {
  id: string
  name: string
}

interface ProductOption {
  id: string
  name: string
  brand: {
    name: string
  }
}

interface UpdateBillboardFormProps {
  categories: CategoryOption[]
  products: ProductOption[]
  data: {
    id: string
    label: string
    description: string
    image: string
    status: string
    categoryId: string
    featuredProductId: string | null
  }
}

const UpdateBillboardForm = ({ categories, products, data }: UpdateBillboardFormProps) => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  //   Form Zod validation.
  const form = useForm<BillboardSchemaType>({
    resolver: zodResolver(billboardSchema),
    defaultValues: {
      categoryId: data.categoryId,
      label: data.label,
      description: data.description,
      image: data.image,
      status: data.status as BillboardSchemaType['status'],
      featuredProductId: data.featuredProductId,
    },
  })
  //   call server action to submit form
  function onSubmit(values: BillboardSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateBillboardAction(values, data.id))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/billboards')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <SelectLabel>Category</SelectLabel>
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

        {/* featured product */}
        <FormField
          control={form.control}
          name="featuredProductId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Product (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a featured product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {products.length === 0 ? (
                    <SelectItem value="" disabled>
                      No products found
                    </SelectItem>
                  ) : (
                    <SelectGroup>
                      <SelectLabel>Products</SelectLabel>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.brand.name} - {product.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Optionally feature a specific product on this billboard
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g. shop smartphones" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt="billboard image"
                        width={500}
                        height={500}
                        quality={95}
                        className="rounded-md border object-cover"
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full"
                        onClick={() => field.onChange('')}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="billboardImageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl)
                        toast.success('Image uploaded successfully!')
                      }}
                      onUploadError={() => {
                        toast.error('Something went wrong. Please try again.')
                      }}
                      className="ut-button:rounded-full ut-button:bg-ultramarine-700 ut-allowed-content:text-muted-foreground mt-4"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {Object.keys(BillboardStatus).map((status) => (
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
              Update Billboard
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateBillboardForm
