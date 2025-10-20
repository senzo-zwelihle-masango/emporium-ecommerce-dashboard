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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { UploadDropzone } from '@/utils/upload/uploadthing'

import { tryCatch } from '@/hooks/use-try-catch'

import { brandSchema, BrandSchemaType } from '@/schemas/dashboard/brand'
import { updateBrandAction } from '@/server/actions/dashboard/brand'

export interface UpdateBrandFormProps {
  brand: {
    id: string
    name: string
    logo: string
    active: boolean
  }
}

const UpdateBrandForm = ({ brand }: UpdateBrandFormProps) => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  //   Form Zod validation.
  const form = useForm<BrandSchemaType>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand.name,
      logo: brand.logo,
      active: brand.active,
    },
  })
  //   call server action to submit form
  function onSubmit(values: BrandSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateBrandAction(values, brand.id))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/brands')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Samsung" {...field} />
              </FormControl>
              <FormDescription>This is the public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* brand logo */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt="brand image"
                        width={400}
                        height={400}
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
                      endpoint="brandImageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl)
                        toast.success('brand logo uploaded successfully!')
                      }}
                      onUploadError={() => {
                        toast.error('Something went wrong. Please try again.')
                      }}
                      className="ut-button:bg-ultramarine-700 ut-allowed-content:text-muted-foreground border-ultramarine-700 ut-button:rounded-full"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* active */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Active</FormLabel>
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
                  {field.value ? 'On' : 'Off'}
                </Label>
              </div>

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
              Update Brand
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateBrandForm
