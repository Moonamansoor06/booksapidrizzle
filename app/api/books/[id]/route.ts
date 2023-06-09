import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from "next/server";
import { BooksTable } from '@/lib/drizzle'
import { db } from '@/lib/drizzle'
import { eq } from 'drizzle-orm';


type Book = {
  id: number
  bookname: string
  booktype: string
  author: string
  qty: number
  price: number
  isbn: string
  createdAt: Date
}



export async function GET(request: NextRequest) {
    const req = await request;
  console.log("request object is",req.nextUrl.pathname)
   
    const thePath=req.nextUrl.pathname
    const idstr = thePath.substring(thePath.lastIndexOf('/') + 1)
    const rid =parseInt(idstr,10)
     console.log("id is", rid)
    if(rid){
       

    const books = await db.select().from(BooksTable)
   .where(eq(BooksTable.id,rid))  
   
    console.log('Books:', books);

    return NextResponse.json( books );
  }
}




export async function PUT(request: NextRequest,apiRequest:NextApiRequest ) {
    const req = await request;
    console.log("request object is",req.nextUrl.pathname)
     
      const thePath=req.nextUrl.pathname
      const idstr = thePath.substring(thePath.lastIndexOf('/') + 1)
      const rid =parseInt(idstr,10)
       console.log("id is",typeof rid)
      if(rid){
    if(apiRequest.body){
    const { bookname, booktype, author, qty, price, isbn } = apiRequest.body

    if (!bookname && !booktype && !author && !qty && !price && !isbn) {
      NextResponse.json({ error: 'At least one field is required to update' })
      return
    }
    const updatedBook = await db.update(BooksTable)
      .set({ bookname, booktype, author, qty, price, isbn })
      .returning()

    if (updatedBook.length > 0) {
      NextResponse.json({ book: updatedBook[0] })
    } else {
      NextResponse.json({ error: `Book with id ${rid} not found` })
    }
}
}
}
export async function DELETE(request: NextRequest, ) {
    const req = await request;
    console.log("request object is",req.nextUrl.pathname)
     
      const thePath=req.nextUrl.pathname
      const idstr = thePath.substring(thePath.lastIndexOf('/') + 1)
      const rid =parseInt(idstr,10)
       console.log("id is",typeof rid)
      if(rid){
    const deletedBook = await db.delete(BooksTable).where(eq(BooksTable.id,rid))
    .returning()

    if (deletedBook.length > 0) {
     NextResponse.json({ book: deletedBook[0] });
      } else {
       NextResponse.json({ error: 'Book not found' });
      }}
  }