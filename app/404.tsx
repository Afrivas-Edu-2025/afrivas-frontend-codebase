import {Error404} from "@/components/404-page.tsx"

export default function PageNotFound(){

    return(
        <>
            <Error404
                postcardImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/statue-of-liberty-oil-pastel-MndxxUm4uk78xLAAKqtCFXH2HmNn0h.jpg"
                postcardAlt="Freetown "
                curvedTextTop="The General Intelligence"
                curvedTextBottom="of Freetown"
                heading="(404) Looks like the page you're looking for got lost somewhere."
                subtext="But hey — in Freetown, even the unexpected detours lead somewhere."
                backButtonLabel="Back to Home"
                backButtonHref="/"
            />
        </>
    )
}