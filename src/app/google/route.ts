import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('place_id')
    
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?fields=geometry&place_id=${id}&key=${process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY}`)
    const data = await res.json()
 
  return NextResponse.json({ data })
}