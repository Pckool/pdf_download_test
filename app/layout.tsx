import Layers from '@/components/Layers'
import './globals.css'

export const metadata = {
  title: 'pdf test',
  description: 'test pdf generation',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <Layers />
        {children}
      </body>
    </html>
  )
}
