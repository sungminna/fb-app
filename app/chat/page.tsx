import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Container } from "postcss"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `username.${a.length - i}`
)

export default function InputWithButton() {
  return (
    <main className="flex h-svh flex-col items-center justify-between p-12">
      <Card className="w-5/6 h-full">
        <CardHeader>
          <CardTitle>Chat Room Name</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ScrollArea className="h-96 w-full rounded-md border">
            <div className="h-full p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                {tags.map((tag) => (
                  <>
                    <div key={tag} className="text-sm">
                      {tag}
                    </div>
                    <Card className="justify-left">
                      <CardContent>
                        <p className="text-left">
                          text
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="jsutify-right">
                      <CardContent className="container mx-auto text-wrap">
                        asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf
                        asdfasdfasdfasdfasdfasdfasdfasdfa
                        sdfasdfasdfassddddddddd
                        asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf
                        ffffffffff
                        ffffffffff

                      </CardContent>
                    </Card>
                    <Separator className="my-2" />
                  </>
                ))}
            </div>
          </ScrollArea>
          <div className="flex w-svh items-center space-x-2 py-6">
            <Input type="text" placeholder="message" />
            <Button type="submit">Send</Button>
          </div>
        </CardContent>
      </Card>
    </main>
    
  )
}
