import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'

function Card() {
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
      overflow : 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://www.facebook.com/photo/?fbid=1768409963574694&set=a.128493840899656"
        title="green iguana"
      />
      <CardContent sx={{ p:1.5, '&:last-child': { p:1.5 } }}>
        <Typography >Linh On</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon ={ <GroupIcon/> }>18</Button>
        <Button size="small" startIcon ={ <CommentIcon/> }>8</Button>
        <Button size="small" startIcon ={ <AttachmentIcon/> }>5</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card