'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { SaveAllIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
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

import { collectionSchema, CollectionSchemaType } from '@/schemas/dashboard/collection'
import { CollectionStatus } from '@/lib/generated/prisma'
import { updateCollectionAction } from '@/server/actions/dashboard/collection'

interface CategoryOption {
  id: string
  name: string
}

interface UpdateCollectionFormProps {
  categories: CategoryOption[]
  data: {
    id: string
    label: string
    description: string | null
    image: string
    color: string | null
    status: string
    categoryId: string
  }
}

const UpdateCollectionForm = ({ categories, data }: UpdateCollectionFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<CollectionSchemaType>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      categoryId: data.categoryId,
      label: data.label,
      description: data.description || '',
      image: data.image,
      color: data.color || '',
      status: data.status as CollectionSchemaType['status'],
    },
  })

  function onSubmit(values: CollectionSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateCollectionAction(values, data.id))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/collections')
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

        {/* color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <ColorPicker
                label="Pick a color"
                color={field.value ?? '#000000'}
                onChange={(hex) => field.onChange(hex)}
                isEyeDroppper
              />
              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                <span className="font-mono">{field.value}</span>
                <div
                  className="h-5 w-5 rounded-full border"
                  style={{ backgroundColor: field.value ?? '#000000' }}
                />
              </div>
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
                        alt="collection image"
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
                      endpoint="collectionImageUploader"
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
                <Input placeholder="description" {...field} />
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {Object.keys(CollectionStatus).map((status) => (
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
              Upadate Collection
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateCollectionForm
