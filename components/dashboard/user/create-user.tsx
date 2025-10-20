'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { tryCatch } from '@/hooks/use-try-catch'

import { createUserSchema, CreateUserSchemaType } from '@/schemas/dashboard/user'
import { Role } from '@/lib/generated/prisma'
import { createUserAction } from '@/server/actions/dashboard/user'
import { PhoneInput } from '@/components/ui/phone-input'
import Image from 'next/image'
import { UploadDropzone } from '@/utils/upload/uploadthing'

const CreateUserForm = () => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  //   Form Zod validation.
  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      phoneNumber: '',
      image: '',
    },
  })

  //   call server action to submit form
  function onSubmit(values: CreateUserSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createUserAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/users')
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
                <Input placeholder="jane doe" {...field} />
              </FormControl>
              <FormDescription>This is the public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="janedoe@example.com" {...field} />
              </FormControl>
              <FormDescription>This is the public email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* phoneNumber */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="ZA"
                  international
                  countryCallingCodeEditable={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* image  */}
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
                        alt="user image"
                        width={200}
                        height={200}
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Please wait...
              <Spinner />
            </>
          ) : (
            <>
              <PlusIcon />
              Create User
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateUserForm
