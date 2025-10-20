'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { CheckIcon, SaveAllIcon, XIcon } from 'lucide-react'

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
import { updatePromotionAction } from '@/server/actions/dashboard/promotion'

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

interface UpdatePromotionFormProps {
  promotion: PromotionSchemaType & { id: string }
  brands: BrandOption[]
  products: ProductOption[]
  tags: TagsOption[]
}

const UpdatePromotionForm = ({ promotion, brands, products, tags }: UpdatePromotionFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<PromotionSchemaType>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      brandId: promotion.brandId,
      label: promotion.label,
      description: promotion.description,
      image: promotion.image,
      active: promotion.active,
      productIds: promotion.productIds,
      tags: promotion.tags,
    },
  })

  function onSubmit(values: PromotionSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updatePromotionAction(promotion.id, values))

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

        {/* Product Selection using Tags */}
        <Controller
          control={form.control}
          name="productIds"
          render={({ field }) => {
            const selectedProductIds = field.value || []

            const handleRemove = (productId: string) =>
              field.onChange(selectedProductIds.filter((id) => id !== productId))

            const handleSelect = (productId: string) => {
              if (selectedProductIds.includes(productId)) {
                handleRemove(productId)
              } else {
                field.onChange([...selectedProductIds, productId])
              }
            }

            return (
              <FormItem>
                <FormLabel>Products</FormLabel>
                <Tags className="max-w-[400px]">
                  <TagsTrigger>
                    {selectedProductIds.map((productId) => {
                      const product = products.find((p) => p.id === productId)
                      if (!product) return null
                      return (
                        <TagsValue key={productId} onRemove={() => handleRemove(productId)}>
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
                            {selectedProductIds.includes(product.id) && (
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

        {/* Tags */}
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
                    {selected.map((tagId) => (
                      <TagsValue key={tagId} onRemove={() => handleRemove(tagId)}>
                        {tags.find((t) => t.id === tagId)?.label}
                      </TagsValue>
                    ))}
                  </TagsTrigger>
                  <TagsContent>
                    <TagsInput placeholder="Search tag..." />
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
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                    name={field.name}
                    ref={field.ref}
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
              <SaveAllIcon />
              Update Promotion
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdatePromotionForm
