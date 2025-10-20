'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { PlusIcon, XIcon, CheckIcon } from 'lucide-react'

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
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from '@/components/kibo-ui/tags/index'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

import { UploadDropzone } from '@/utils/upload/uploadthing'

import { tryCatch } from '@/hooks/use-try-catch'

import { promotionSchema, PromotionSchemaType } from '@/schemas/dashboard/promotion'
import { createPromotionAction } from '@/server/actions/dashboard/promotion'

interface ProductOption {
  id: string
  name: string
}

interface BrandOption {
  id: string
  name: string
}

interface TagsOption {
  id: string
  label: string
}

interface CreatePromotionFormProps {
  brands: BrandOption[]
  products: ProductOption[]
  tags: TagsOption[]
}

const CreatePromotionForm = ({ brands, products, tags }: CreatePromotionFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<PromotionSchemaType>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      brandId: '',
      label: '',
      description: '',
      image: '',
      active: false,
      productIds: [],
      tags: [],
    },
  })

  const onSubmit = (values: PromotionSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createPromotionAction(values))

      if (error) {
        toast.error('Unexpected error occurred. Please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/promotions')
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Brand */}
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
                  <SelectGroup>
                    <SelectLabel>Brands</SelectLabel>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promotion Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Sale" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter promotion description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image */}
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
                        alt="promotion image"
                        width={500}
                        height={500}
                        quality={95}
                        className="rounded-md border object-cover"
                        unoptimized
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

        {/* Products */}
        <Controller
          control={form.control}
          name="productIds"
          render={({ field }) => {
            const selected = field.value || []
            const handleRemove = (id: string) => field.onChange(selected.filter((v) => v !== id))
            const handleSelect = (id: string) =>
              field.onChange(
                selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]
              )

            return (
              <FormItem>
                <FormLabel>Products</FormLabel>
                <Tags className="max-w-[400px]">
                  <TagsTrigger>
                    {selected.map((id) => {
                      const product = products.find((p) => p.id === id)
                      if (!product) return null
                      return (
                        <TagsValue key={id} onRemove={() => handleRemove(id)}>
                          {product.name}
                        </TagsValue>
                      )
                    })}
                  </TagsTrigger>
                  <TagsContent>
                    <TagsInput placeholder="Search products..." />
                    <TagsList>
                      <TagsEmpty />
                      <TagsGroup>
                        {products.map((product) => (
                          <TagsItem
                            key={product.id}
                            onSelect={() => handleSelect(product.id)}
                            value={product.id}
                          >
                            {product.name}
                            {selected.includes(product.id) && (
                              <CheckIcon className="text-muted-foreground" size={14} />
                            )}
                          </TagsItem>
                        ))}
                      </TagsGroup>
                    </TagsList>
                  </TagsContent>
                </Tags>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Tags with inline creation */}
        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => {
            const selected = field.value || []
            const handleRemove = (value: string) =>
              field.onChange(selected.filter((v) => v !== value))
            const handleSelect = (value: string) =>
              field.onChange(
                selected.includes(value)
                  ? selected.filter((v) => v !== value)
                  : [...selected, value]
              )

            return (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <Tags className="max-w-[400px]">
                  <TagsTrigger>
                    {selected.map((tag) => (
                      <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
                        {tags.find((t) => t.id === tag)?.label ?? tag}
                      </TagsValue>
                    ))}
                  </TagsTrigger>
                  <TagsContent>
                    <TagsInput
                      placeholder="Search or create tag..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault()
                          const newTag = e.currentTarget.value.trim()
                          if (!selected.includes(newTag)) {
                            field.onChange([...selected, newTag])
                          }
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <TagsList>
                      <TagsEmpty />
                      <TagsGroup>
                        {tags.map((tag) => (
                          <TagsItem
                            key={tag.id}
                            onSelect={() => handleSelect(tag.id)}
                            value={tag.id}
                          >
                            {tag.label}
                            {selected.includes(tag.id) && (
                              <CheckIcon className="text-muted-foreground" size={14} />
                            )}
                          </TagsItem>
                        ))}
                      </TagsGroup>
                    </TagsList>
                  </TagsContent>
                </Tags>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Active */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Active Promotion</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Toggle Active"
                  />
                </FormControl>
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.value ? 'Yes' : 'No'}
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Please wait...
            </>
          ) : (
            <>
              <PlusIcon />
              Create Promotion
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreatePromotionForm
