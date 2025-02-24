import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store'

const AddEditAction = () => {
  const { addEdit } = useParams()

  const { isLoading } = useAppSelector(state => state.category)

  return (
    <div className='flex mt-4 justify-end'>
      <Button disabled={isLoading} variant='outline' type='submit'>
        {addEdit === 'add' ? "Kategoriya qo'shish" : "Kategoriyani o'zgartirish"}
      </Button>
    </div>
  )
}

export default AddEditAction
