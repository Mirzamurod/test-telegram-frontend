'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Table from '@/components/table'
import { TSortModel } from '@/types/table'
import TableHeader from '../_components/list/TableHeader'
import columns, { mobileColumns } from '../_components/list/columns'
import { useAppSelector } from '@/store'
import { getFlowers } from '@/store/flowers'

const FlowersList = () => {
  const dispatch = useDispatch()
  const [ordering, setOrdering] = useState<TSortModel | null>(null)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState('10')

  const { isLoading, flowers, pageCount, success } = useAppSelector(state => state.flower)

  const getData = () =>
    dispatch(
      getFlowers({ search, page, limit, sortName: ordering?.field, sortValue: ordering?.sort })
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
        data={flowers}
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

export default FlowersList
