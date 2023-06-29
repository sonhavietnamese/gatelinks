'use client'

import { getProductsByWallet } from '@/actions/get-products-by-wallet'
import { getUser } from '@/actions/get-user'
import CoverPicture from '@/components/cover-picture'
import DynamicIsland from '@/components/dynamic-island'
import NewProduct from '@/components/new-product'
import Products from '@/components/products'
import Profile from '@/components/profile'
import useEditProfile from '@/hooks/useEditProfile'
import useNewProductModal from '@/hooks/useNewProductModal'
import { firestore } from '@/libs/firebase'
import { Product } from '@/types/product'
import { User } from '@/types/user'
import { useWallet } from '@solana/wallet-adapter-react'
import { spawn } from 'child_process'
import { doc, setDoc } from 'firebase/firestore'
import { ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import EditProfile from './edit-profile'
import Stats from './stats'

export default function WithWallet() {
  const { publicKey } = useWallet()
  const isNewProductModal = useNewProductModal((s) => s.isOpen)
  const isEditProfileModal = useEditProfile((s) => s.isOpen)

  const [products, setProducts] = useState<Product[]>()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const getData = async () => {
      if (!publicKey) return

      const userData = getUser(publicKey.toString())
      const productsData = getProductsByWallet(publicKey.toString())

      const [user, products] = await Promise.all([userData, productsData])

      if (!user) {
        try {
          await setDoc(doc(firestore, 'users', publicKey.toString()), {
            wallet: publicKey.toString(),
            username: publicKey.toString(),
          })

          setUser({
            username: publicKey.toString(),
            wallet: publicKey.toString(),
          })
          setProducts(undefined)
        } catch (error) {
          console.log('Write to firestore failed: ', error)
        } finally {
        }
      } else {
        setUser(user)
        setProducts(products)
      }
    }

    !isNewProductModal && !isEditProfileModal && getData()
  }, [publicKey, isNewProductModal, isEditProfileModal])

  return (
    <div className='w-[900px] bg-base-100 min-h-screen overflow-auto no-scrollbar'>
      {publicKey ? (
        user ? (
          <>
            <CoverPicture seed={user.wallet} />
            <Profile username={user.username} wallet={user.wallet} />

            <Stats />
            <Products products={products} />

            <NewProduct />
            <EditProfile />
          </>
        ) : (
          <span>Loading</span>
        )
      ) : (
        <div className='flex w-full h-screen items-center justify-center flex-col gap-4'>
          <button className='btn btn-primary no-animation btn-active'>Connect Your wallet first</button>

          <ArrowDown size={40} className='animate-bounce' />
        </div>
      )}
      <DynamicIsland />
    </div>
  )
}
