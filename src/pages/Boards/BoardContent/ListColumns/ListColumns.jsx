import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PostAddIcon from '@mui/icons-material/PostAdd'
import Column from './Column/Column'
function ListColumns() {
  return (
    <Box sx={{
      bgcolor:'inherit',
      width:'100%',
      height:'100%',
      display:'flex',
      overflowX :'auto',
      overflowY :'hidden',
      '&::-webkit-scrollbar-track':{ m : 2 }
    }}>
      {/* Box Column */}
      <Column/>
			{/* Button add new column */}
      <Box sx={{
        minWidth:'200px',
        maxWidth:'200px',
        mx :2,
        borderRadius :'6px',
        height:'fit-content',
        bgcolor : '#ffffff3d'
      }}>
        <Button startIcon={<PostAddIcon/>} sx={{ color:'white', width:'100%', justifyContent:'flex-start', pl:2.5, py:1 }}>Add new column</Button>
      </Box>
    </Box>
  )
}

export default ListColumns
