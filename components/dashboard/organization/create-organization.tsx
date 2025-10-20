'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import slugify from 'slugify'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { SparkleIcon, PlusIcon, XIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { tryCatch } from '@/hooks/use-try-catch'
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
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { UploadDropzone } from '@/utils/upload/uploadthing'
import { OrganizationSchemaType, organizationSchema } from '@/schemas/dashboard/organization'
import { createOrganizationAction } from '@/server/actions/dashboard/organization'

const CreateOrganizationForm = () => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  //   Form Zod validation.
  const form = useForm<OrganizationSchemaType>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      slug: '',
      logo: '',
    },
  })
  //   call server action to submit form
  function onSubmit(values: OrganizationSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createOrganizationAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/organization')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* label */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>Give the org a short, descriptive name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-end space-x-4">
          {/* slug */}
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
            className="w-fit"
            onClick={() => {
              const nameValue = form.getValues('name')
              const slug = slugify(nameValue)
              form.setValue('slug', slug, { shouldValidate: true })
            }}
          >
            Generate Slug
            <SparkleIcon className="ml-1 size-4" />
          </Button>
        </div>

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt="Organization Logo"
                        width={100}
                        height={100}
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
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl)
                        toast.success('logo uploaded successfully!')
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Please wait...
              <Spinner />
            </>
          ) : (
            <>
              Create Organization
              <PlusIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateOrganizationForm
