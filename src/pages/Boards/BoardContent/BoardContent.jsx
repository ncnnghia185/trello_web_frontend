import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
function BoardContent() {

  return (
    <Box sx={{
      width:'100%',
      height:(theme) => theme.trello.boardContentHeight,
      display:'flex',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#74b9ff'),
      p : '10px 0'
    }}>
      <ListColumns/>
    </Box>
  )
}
export default BoardContent