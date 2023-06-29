import { candypay } from '@/libs/candypay'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, price, image, ownerWallet, ownerUsername } = await req.json()

  try {
    const response = await candypay.session.create({
      success_url: `${process.env.STATIC_URL}/success`,
      cancel_url: `${process.env.STATIC_URL}/cancel`,
      tokens: ['dust', 'samo'],
      items: [
        {
          name,
          price,
          image,
          quantity: 1,
        },
      ],
      shipping_fees: 0,
      custom_data: {
        name: ownerUsername,
        image: `https://source.boringavatars.com/beam/120/${ownerWallet}?square&?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`,
        wallet_address: ownerWallet,
      },
    })

    return NextResponse.json({ message: 'OK', response })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ message: 'FAIL' })
  }
}
