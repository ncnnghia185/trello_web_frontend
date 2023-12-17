import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, MouseSensor, TouchSensor , useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  // yêu cầu chuột di chuyển 10px mới kích hoạt event, sửa trường hợp click gọi event

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance:10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay:250, tolerance:5 } })

  const sensors = useSensors( mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect( () => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      // Vị trí cũ của column
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Vị trí mới của column
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove( orderedColumns, oldIndex, newIndex )
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={ handleDragEnd } sensors={ sensors }>
      <Box sx={{
        width:'100%',
        height:(theme) => theme.trello.boardContentHeight,
        display:'flex',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#74b9ff'),
        p : '10px 0'
      }}>
        <ListColumns columns = { orderedColumns } />
      </Box>
    </DndContext>
  )
}
export default BoardContent