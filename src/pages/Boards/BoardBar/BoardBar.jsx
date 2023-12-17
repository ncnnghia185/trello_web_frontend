import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
const MUNE_STYLE = {
  color : 'white',
  bgcolor : 'transparent',
  border:'none',
  paddingX:'5px',
  borderRadius : '4px',
  '.MuiSvgIcon-root':{
    color :'white'
  },
  '&:hover':{
    bgcolor : 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box px={2} sx={{
      width:'100%',
      height:(theme) => theme.trello.boardBarHeight,
      display:'flex',
      alignItems:'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX : 'auto',
      bgcolor: (theme) => (
        theme.palette.mode === 'dark' ? '#34495e' : '#74b9ff'
      )
    }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
        <Chip
          sx={ MUNE_STYLE }
          icon= { <DashboardCustomizeIcon /> }
          label={ board?.title }
          clickable
        />
        <Chip
          sx={ MUNE_STYLE }
          icon= { <VpnLockIcon /> }
          label={ capitalizeFirstLetter(board?.type) }
          clickable
        />
        <Chip
          sx={ MUNE_STYLE }
          icon= { <AddToDriveIcon /> }
          label="Add to Google Drive"
          clickable
        />
        <Chip
          sx={ MUNE_STYLE }
          icon= { <BoltIcon /> }
          label="Automation"
          clickable
        />
        <Chip
          sx={ MUNE_STYLE }
          icon= { <FilterListIcon /> }
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx ={{
            color :'white',
            borderColor :'white',
            '&:hover':{ borderColor: 'white' }
          }}
        >Invite</Button>
        <AvatarGroup max={4}
          sx={{
            gap : '10px',
            '& .MuiAvatar-root':{
              width:'34px',
              height:'34px',
              fontSize:'16px',
              border : 'none',
              color : 'white',
              cursor : 'pointer',
              '&:first-of-type':{ bgcolor :'#a4b0be' }
            }
          }}
        >
          <Tooltip title='TTHL'>
            <Avatar
              alt="TTHL"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>

  )
}
export default BoardBar