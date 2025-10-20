'use client'

import React, { useState, useTransition } from 'react'
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
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { UploadDropzone } from '@/utils/upload/uploadthing'

import { tryCatch } from '@/hooks/use-try-catch'

import { cn } from '@/lib/utils'

import { membershipSchema, MembershipSchemaType } from '@/schemas/dashboard/membership'
import { createMembershipAction } from '@/server/actions/dashboard/membership'

const CreateMembershipForm = () => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [newBenefitInput, setNewBenefitInput] = useState('')
  //   Form Zod validation.
  const form = useForm<MembershipSchemaType>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      title: '',
      description: '',
      benefits: [],
      popular: false,
      minPoints: 0,
      maxPoints: 0,
      crown: '',
    },
  })
  // Benefits Array States
  const handleAddBenefit = () => {
    const benefitText = newBenefitInput.trim()
    if (!benefitText) {
      toast.error('Benefit cannot be empty.')
      form.setError('benefits', {
        type: 'manual',
        message: 'Please add a valid benefit.',
      })
      return
    }
    // Get current array from react-hook-form
    const currentBenefits = form.getValues('benefits')
    if (currentBenefits.includes(benefitText)) {
      toast.error('This benefit already exists.')
      form.setError('benefits', {
        type: 'manual',
        message: 'This benefit has already been added.',
      })
      return
    }
    // Re-validate the benefits field after adding
    form.setValue('benefits', [...currentBenefits, benefitText], {
      shouldValidate: true,
      shouldDirty: true,
    })
    // Clear the input field
    setNewBenefitInput('')
    form.clearErrors('benefits')
  }

  // Handler to remove a benefit from the form's benefits array
  const handleRemoveBenefit = (benefitToRemove: string) => {
    const currentBenefits = form.getValues('benefits')
    form.setValue(
      'benefits',
      currentBenefits.filter((benefit) => benefit !== benefitToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    )

    if (
      form.getValues('benefits').length === 0 &&
      membershipSchema.shape.benefits.isOptional() === false
    ) {
      form.setError('benefits', {
        type: 'manual',
        message: 'Please add at least one benefit.',
      })
    }
  }
  //   call server action to submit form
  function onSubmit(values: MembershipSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createMembershipAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/memberships')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Bronze" {...field} />
              </FormControl>
              <FormDescription>Give the membership a short, descriptive name.</FormDescription>
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
                <Textarea
                  placeholder="Provide a little bit about this membership..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of what this membership offers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Benefits */}
        <FormItem>
          <FormLabel>Benefits</FormLabel>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add a new benefit"
              value={newBenefitInput}
              onChange={(e) => setNewBenefitInput(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddBenefit()
                }
              }}
              className={cn(form.formState.errors.benefits && 'border-destructive')}
            />
            <Button type="button" onClick={handleAddBenefit} variant="outline">
              <PlusIcon className="h-4 w-4" /> Add
            </Button>
          </div>
          <FormDescription>
            List the key advantages and features of this membership.
          </FormDescription>
          {/* Display current benefits */}
          {form.getValues('benefits').length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.getValues('benefits').map((benefit, index) => (
                <span key={index} className="inline-flex items-center rounded-full">
                  {benefit}
                  <Button
                    type="button"
                    onClick={() => handleRemoveBenefit(benefit)}
                    size={'icon'}
                    variant={'destructive'}
                    className="ml-2 size-8 rounded-full"
                  >
                    <XIcon />
                    <span className="sr-only">Remove benefit</span>
                  </Button>
                </span>
              ))}
            </div>
          )}
          {/* Display error message for benefits */}
          {form.formState.errors.benefits && (
            <FormMessage className="mt-2">{form.formState.errors.benefits.message}</FormMessage>
          )}
        </FormItem>

        {/* Popular  */}
        <FormField
          control={form.control}
          name="popular"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Popular Membership</FormLabel>
                <FormDescription>
                  Mark this membership as &quot;popular&quot; to highlight it.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Minimum Points */}
        <FormField
          control={form.control}
          name="minPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Points</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value))
                  }}
                />
              </FormControl>
              <FormDescription>
                The minimum points required to attain this membership level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Maximum Points */}
        <FormField
          control={form.control}
          name="maxPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Points</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 500 (or 0 for no upper limit)"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value))
                  }}
                />
              </FormControl>
              <FormDescription>
                The maximum points for this membership. Set to 0 if there&apos;s no upper limit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* crown  */}
        <FormField
          control={form.control}
          name="crown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crown</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt="membership crown Logo"
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
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl)
                        toast.success('crown uploaded successfully!')
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
              Create Membership
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateMembershipForm
