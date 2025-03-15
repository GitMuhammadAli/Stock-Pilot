import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function VerifyRequest() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-primary p-4">
            <Card className="w-full max-w-md bg-bg-secondaryborder-none shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="bg-bg-tertiary p-3 rounded-full">
                            <Mail className="h-10 w-10 text-brand-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white text-center">Check your email</CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                        We've sent you a secure login link. Please check your email inbox.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="bg-bg-tertiary p-4 rounded-md mb-4">
                        <p className="text-sm text-gray-300">
                            If you don't see the email in your inbox, check your spam folder. The link will expire after 24 hours.
                        </p>
                    </div>
                </CardContent>

                <Separator className="bg-bg-tertiary" />

                <CardFooter className="flex justify-center pt-4">
                    <Link href="/login">
                        <Button variant="outline" className="text-white border-bg-tertiary bg-transparent hover:bg-tertiary">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

