import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, closestCorners } from '@dnd-kit/core'
import { useState } from 'react'
import { useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
import Card from './ListColumns/Column/ListCards/Card/Card'
import Column from './ListColumns/Column/Column'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN : 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD : 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // yêu cầu chuột di chuyển 10px mới kích hoạt event, sửa trường hợp click gọi event

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance:10 } })

  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay:250, tolerance:5 } })

  const sensors = useSensors( mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có một phần tử được kéo (column hoặc card)
  const [activeDragItemId, setactiveDragItemId] = useState([null])
  const [activeDragItemType, setactiveDragItemType] = useState([null])
  const [activeDragItemData, setactiveDragItemData] = useState([null])
  const [oldColumnDragCard, setOldColumnDragCard] = useState([null])

  useEffect( () => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = ( cardId ) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  // Cập nhật state trong trường hợp di chuyển card giữa column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns( prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      let newCardIndex
      const isBelowOverItem =active.rect.current.translated &&
        active.rect.current.translated.top >over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1
      const nextColumns = cloneDeep( prevColumns )
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if ( nextActiveColumn ) {
        // Xóa card khỏi column active (column trước khi kéo sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if ( nextOverColumn ) {
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId : nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }
  // Trigger khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      // Nếu kéo Card thì thực hiện hành động set giá trị oldColumn
      setOldColumnDragCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    // Không làm gì khi đang kéo Column
    if (!activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Xử lý để kéo card qua lại giữa các column
    const { active, over } = event
    // Đảm bảo nếu không tồn tại active hoặc cover (khi kéo ra khỏi phạm vi container) thì không làm gì cả
    if ( !active || !over) return

    // activeDraggingCard là card đang được kéo
    const { id : activeDraggingCardId, data : { current : activeDraggingCardData } } = active
    // overCard là card đang tương tác
    const { id : overCardId } = over

    // Tìm 2 column theo cardid
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kết thúc kéo một phần tử

  const handleDragEnd = (event) => {
    const { active, over } = event
    // Đảm bảo nếu không tồn tại active hoặc cover (khi kéo ra khỏi phạm vi container) thì không làm gì cả
    if ( !active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard là card đang được kéo
      const { id : activeDraggingCardId, data : { current : activeDraggingCardData } } = active
      // overCard là card đang tương tác
      const { id : overCardId } = over

      // Tìm 2 column theo cardid
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return
      if (oldColumnDragCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns (
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Trường hợp kéo card trong cùng một column
        // Vị trí cũ của card (từ oldColumnDragCard)
        const oldCardIndex = oldColumnDragCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Vị trí mới của cardn
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndOrderedCards = arrayMove( oldColumnDragCard?.cards, oldCardIndex, newCardIndex )

        setOrderedColumns( prevColumns => {
          const nextColumns = cloneDeep( prevColumns )
          // Tìm tới column đang thả 
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          // Cập nhật lại 3 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          return nextColumns
        })
      }
    }

    // Xử lý kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
      // Vị trí cũ của column
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Vị trí mới của column
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        const dndOrderedColumns = arrayMove( orderedColumns, oldColumnIndex, newColumnIndex )
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        setOrderedColumns(dndOrderedColumns)
      }
    }
    setactiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
    setOldColumnDragCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      collisionDetection={ closestCorners }
      onDragStart={ handleDragStart }
      onDragOver={ handleDragOver }
      onDragEnd={ handleDragEnd }
      sensors={ sensors }>
      <Box sx={{
        width:'100%',
        height:(theme) => theme.trello.boardContentHeight,
        display:'flex',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#74b9ff'),
        p : '10px 0'
      }}>
        <ListColumns columns = { orderedColumns } />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemId || !activeDragItemType) && null}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column = { activeDragItemData } />}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card = { activeDragItemData } />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}
export default BoardContent