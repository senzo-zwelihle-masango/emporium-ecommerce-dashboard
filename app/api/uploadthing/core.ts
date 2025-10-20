import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/lib/auth'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({}) => {
      // This code runs on your server before upload
      // const user = await auth(req); // Original line
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session) {
        redirect('/signin')
      }

      // If you throw, the user will not be able to upload
      // if (!user) throw new UploadThingError("Unauthorized"); // Original line

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),

  // brand image
  brandImageUploader: f({
    image: {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    // Set permissions
    .middleware(async ({}) => {
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session) {
        redirect('/signin')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  // collection
  collectionImageUploader: f({
    image: {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    // Set permissions
    .middleware(async ({}) => {
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session) {
        redirect('/signin')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  // billboard
  billboardImageUploader: f({
    image: {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    // Set permissions
    .middleware(async ({}) => {
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session) {
        redirect('/signin')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  // promotion
  promotionImageUploader: f({
    image: {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    // Set permissions
    .middleware(async ({}) => {
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session) {
        redirect('/signin')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  // product
  productImageUploader: f({
    image: {
      maxFileSize: '16MB',
      maxFileCount: 10,
    },
  })
    // Set permissions
    .middleware(async ({}) => {
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session) {
        redirect('/signin')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  // document
  documentUploader: f({
    'application/pdf': {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    // Set permissions
    .middleware(async ({}) => {
      const session = await auth.api.getSession({ headers: await headers() })

      if (!session) {
        redirect('/signin')
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
