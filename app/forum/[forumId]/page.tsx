import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import Link from "next/link";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Component({ params }: {params: {forumId: string}}) {
    const forums = [{'topicName': 'topic1', 'description': 'description1'}, {'topicName': 'topic2', 'description': 'description2'}, {'topicName': 'topic3', 'description': 'description3'}, ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics/ {params.forumId}</CardTitle>
        <CardDescription>
          Topic is here~~
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
            {
                forums.map((topic, index) => (
                    <TableRow key={ index }>
                        <TableCell className="hidden sm:table-cell">
                            <Image
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src="/placeholder.svg"
                            width="64"
                            />
                        </TableCell>
                        <TableCell className="font-medium">
                            <Link href={`/forum/${params.forumId}/${index}`}>{topic.topicName}</Link>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">Draft</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{topic.description}</TableCell>
                        <TableCell className="hidden md:table-cell">25</TableCell>
                        <TableCell className="hidden md:table-cell">
                            2023-07-12 10:42 AM
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
            }

          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  )
}
