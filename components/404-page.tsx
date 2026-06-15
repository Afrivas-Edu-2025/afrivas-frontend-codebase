import { ArrowRight, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Error404Props {
  heading?: string
  subtext?: string
  backButtonLabel?: string
  backButtonHref?: string
}

export function Error404({
  heading = "Page not found",
  subtext = "The page you're looking for doesn't exist or may have been moved.",
  backButtonLabel = "Back to Home",
  backButtonHref = "/",
}: Error404Props) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center text-center max-w-md">
        <Image
          src="/images/logo.webp"
          width={56}
          height={56}
          alt="Afrivas Logo"
          className="rounded-md mb-6"
        />
        <span className="text-7xl font-bold text-primary-100 mb-4">404</span>
        <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-balance">{heading}</h1>
        <p className="text-muted-foreground mb-8">{subtext}</p>
        <Button asChild className="gap-2">
          <Link href={backButtonHref}>
            <Home className="w-4 h-4" />
            {backButtonLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
