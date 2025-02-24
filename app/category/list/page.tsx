'use client'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Table from '@/components/table'
import { TSortModel } from '@/types/table'
import TableHeader from '../_components/list/TableHeader'
import columns from '../_components/list/columns'
import { useAppSelector } from '@/store'
import { getCategories } from '@/store/category'

const CategoriesList = () => {
  const dispatch = useDispatch()
  const [ordering, setOrdering] = useState<TSortModel | null>(null)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState('10')

  const { isLoading, categories, pageCount, success } = useAppSelector(state => state.category)

  const getData = () =>
    dispatch(
      getCategories({ search, page, limit, sortName: ordering?.field, sortValue: ordering?.sort })
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
        data={categories}
        columns={columns}
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

export default CategoriesList
