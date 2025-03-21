'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'next/navigation'
import Table from '@/components/table'
import { TSortModel } from '@/types/table'
import TableHeader from '../_components/TableHeader'
import columns, { mobileColumns } from '../_components/columns'
import { useAppSelector } from '@/store'
import { getOrders } from '@/store/orders'

const OrdersStatusList = () => {
  const dispatch = useDispatch()
  const { status } = useParams()
  const [ordering, setOrdering] = useState<TSortModel | null>(null)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState('10')

  const { isLoading, orders, pageCount, success } = useAppSelector(state => state.orders)

  const getData = () =>
    dispatch(
      getOrders({
        search,
        page,
        limit,
        sortName: ordering?.field,
        sortValue: ordering?.sort,
        status,
      })
    )

  useEffect(() => {
    getData()
  }, [search, page, limit, ordering?.field, ordering?.sort])

  useEffect(() => {
    if (success) getData()
  }, [success])

  const onChange = (item: { page: number; limit: string }) => {
    setPage(item.page)
    setLimit(item.limit)
  }

  return (
    <div>
      <TableHeader setSearch={setSearch} />
      <Table
        data={orders}
        columns={columns}
        mobileColumns={mobileColumns}
        loading={isLoading}
        pageCount={pageCount}
        sortModel={ordering}
        paginationModel={{ page, limit }}
        onPaginationModelChange={onChange}
        onSortModelChange={sort => setOrdering(sort)}
      />
    </div>
  )
}

export default OrdersStatusList
