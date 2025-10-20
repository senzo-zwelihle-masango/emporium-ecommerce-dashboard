'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { PlusIcon, XIcon } from 'lucide-react'

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { UploadDropzone } from '@/utils/upload/uploadthing'

import { tryCatch } from '@/hooks/use-try-catch'

import { createSwatchAction } from '@/server/actions/dashboard/swatch'
import { swatchSchema, SwatchSchemaType } from '@/schemas/dashboard/swatch'
import { ProductSwatchType, ProductStatus } from '@/lib/generated/prisma'

interface CreateSwatchFormProps {
  productId: string
}

const CreateSwatchForm = ({ productId }: CreateSwatchFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<SwatchSchemaType>({
    resolver: zodResolver(swatchSchema),
    defaultValues: {
      productId,
      type: 'color',
      name: '',
      value: '',
      images: [],
      status: 'active',
    },
  })

  function onSubmit(values: SwatchSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createSwatchAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push(`/dashboard/products/${productId}`)
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select swatch type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ProductSwatchType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Red, Large, 256GB" {...field} />
              </FormControl>
              <FormDescription>Display name for this variant option</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* value */}
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input placeholder="e.g. #FF0000, XL, 256" {...field} />
              </FormControl>
              <FormDescription>
                Technical value (hex code for colors, size code, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {field.value.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Swatch image ${index + 1}`}
                            width={200}
                            height={200}
                            className="rounded-md border object-cover"
                            unoptimized
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 rounded-full"
                            onClick={() => {
                              const newImages = [...field.value]
                              newImages.splice(index, 1)
                              field.onChange(newImages)
                            }}
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
                      const newImages = res.map((file) => file.ufsUrl)
                      field.onChange([...field.value, ...newImages])
                      toast.success('Images uploaded successfully!')
                    }}
                    onUploadError={() => {
                      toast.error('Something went wrong. Please try again.')
                    }}
                    className="ut-button:bg-ultramarine-700 ut-allowed-content:text-muted-foreground border-ultramarine-700 ut-button:rounded-full"
                  />
                </div>
              </FormControl>
              <FormDescription>Upload images for this variant option</FormDescription>
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
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ProductStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
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
              <PlusIcon />
              Create Swatch
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateSwatchForm
