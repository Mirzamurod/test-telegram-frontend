'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { editOrder, getOrder } from '@/store/orders'
import { useAppSelector } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getSum } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Prepayment from '@/components/prepayment'
import { yandexgo } from '@/lib/constants'

const ViewOrder = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { data: session } = useSession()

  const { isLoading, order, success } = useAppSelector(state => state.orders)

  const confirm = () => dispatch(editOrder(order?._id!, { status: 'old' }))

  let data: any = {}
  if (session?.currentUser?.location?.split(', ').length) {
    data.start_lat = session?.currentUser?.location?.split(', ')[0]
    data.start_lon = session?.currentUser?.location?.split(', ')[1]
  }

  useEffect(() => {
    dispatch(getOrder(id as string))
  }, [id])

  useEffect(() => {
    if (success) dispatch(getOrder(id as string))
  }, [id, success])

  return (
    <div>
      <div className='flex md:flex-row flex-col md:justify-between'>
        <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight'>Zakazni ko'rish</h2>
        {order ? (
          <Button asChild>
            <Link href={`/orders/status/${order?.status}`}>Gullarga o'tish</Link>
          </Button>
        ) : null}
      </div>
      {isLoading ? (
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-24' />
          <Skeleton className='h-24' />
          <Skeleton className='h-24' />
        </div>
      ) : (
        <div className='mb-4 mt-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Umumiy ma'lumot</CardTitle>
              {order?.status === 'new' ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size='sm' disabled={order.prepayment && order.payment === 'pending'}>
                      Tayyor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ishonchingiz komilmi?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter className='gap-2'>
                      <Button onClick={confirm} disabled={isLoading}>
                        Ha
                      </Button>
                      <DialogClose asChild>
                        <Button variant='secondary' disabled={isLoading}>
                          Yo'q
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : null}
            </CardHeader>
            <Separator />
            <CardContent className='mt-5'>
              <p>
                <b>Mijoz raqami: </b> &nbsp; {order?.customerId.phone}
              </p>
              <p>
                <b>Mijoz ismi: </b> &nbsp; {order?.customerId.name}
              </p>
              <p>
                <b>Tayyor bo'lish sanasi: </b> &nbsp; {order?.date?.slice(0, 10)}
              </p>
              {order?.prepaymentImage ? (
                <div>
                  <b>Oldindan to'lov: </b> &nbsp;
                  <Prepayment order={order!} />
                </div>
              ) : null}
              {order?.location ? (
                <div>
                  <b>Manzil: </b> &nbsp;
                  <Link
                    target='_blank'
                    className='underline'
                    href={yandexgo({
                      end_lat: order.location.latitude,
                      end_lon: order.location.longitude,
                      ...(Object.keys(data).length ? data : {}),
                    })}
                  >
                    Ko'rish
                  </Link>
                </div>
              ) : null}
            </CardContent>
            {order?.bouquet.bouquets.length ? (
              <>
                <Separator />
                <CardContent className='mt-5'>
                  <p>
                    <b>Buketlar soni: </b> &nbsp; {order?.bouquet?.qty} ta
                  </p>
                  <p>
                    <b>Buketlar narxi: </b> &nbsp; {getSum(order?.bouquet.price)}
                  </p>
                </CardContent>
              </>
            ) : null}
            {order?.flower.flowers.length ? (
              <>
                <Separator />
                <CardContent className='mt-5'>
                  <p>
                    <b>Gullar soni: </b> &nbsp; {order?.flower.qty} ta
                  </p>
                  <p>
                    <b>Umumiy narxi: </b> &nbsp; {getSum(order?.flower.price)}
                  </p>
                </CardContent>
              </>
            ) : null}
            <Separator />
            <CardContent className='mt-5'>
              <p>
                <b>Buketlar umumiy soni: </b> &nbsp;{' '}
                {isNaN(order?.bouquet.qty! + order?.flower.qty!)
                  ? 0
                  : order?.bouquet.qty! + order?.flower.qty!}{' '}
                ta
              </p>
              <p>
                <b>Buketlar umumiy narxi: </b> &nbsp;{' '}
                {getSum(order?.bouquet.price! + order?.flower.price!)}
              </p>
            </CardContent>
          </Card>
          {order?.bouquet.bouquets.length ? (
            <Card className='mt-2 p-6'>
              <Collapsible>
                <CollapsibleTrigger>Buketlar</CollapsibleTrigger>
                <CollapsibleContent className='mt-3'>
                  <div className='flex flex-wrap gap-4'>
                    {order.bouquet.bouquets.map(bouquet => (
                      <Card
                        key={bouquet.bouquetId._id}
                        className='w-auto overflow-hidden col-span-2'
                      >
                        <div className='relative w-44 h-40'>
                          <Image
                            fill
                            src={bouquet.bouquetId.image}
                            alt='bouquet image'
                            className='object-cover w-full h-auto'
                          />
                        </div>
                        <CardContent className='p-2'>
                          {bouquet.bouquetId.name ? (
                            <p>
                              <b>Nomi: </b> {bouquet.bouquetId.name}
                            </p>
                          ) : null}
                          <p>
                            <b>Narxi: </b>
                            {getSum(bouquet.price)}
                          </p>
                          <p>
                            <b>Soni: </b>
                            {bouquet.qty} ta
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ) : null}
          {order?.flower.flowers.length ? (
            <Card className='mt-2 p-6'>
              <Collapsible>
                <CollapsibleTrigger>Gullar</CollapsibleTrigger>
                <CollapsibleContent className='mt-3'>
                  <div className='flex flex-wrap gap-4'>
                    {order.flower.flowers.map(flower => (
                      <Card key={flower.flowerId._id} className='w-auto overflow-hidden col-span-2'>
                        <div className='relative w-44 h-40'>
                          <Image
                            fill
                            src={flower.flowerId.image}
                            alt='flower image'
                            className='object-cover w-full h-auto'
                          />
                        </div>
                        <CardContent className='p-2'>
                          {flower.flowerId.name ? (
                            <p>
                              <b>Nomi: </b> {flower.flowerId.name}
                            </p>
                          ) : null}
                          <p>
                            <b>Narxi: </b>
                            {getSum(flower.price)}
                          </p>
                          <p>
                            <b>Soni: </b>
                            {flower.qty} ta
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default ViewOrder
