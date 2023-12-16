
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { teal, deepOrange, cyan, orange } from '@mui/material/colors'


// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    light: { },
    dark: { }
  },
  components: {
    MuiCssBaseline:{
      styleOverrides:{
        body:{
          '*::-webkit-scrollbar':{
            width :'6px',
            height :'6px'
          },
          '*::-webkit-scrollbar-thumb':{
            backgroundColor : '#bdc3c7',
            borderRadius: '10px'
          },
          '*::-webkit-scrollbar-thumb:hover':{
            backgroundColor : 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover' : { borderWidth: '0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize : '0.875rem'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize:'0.875rem',
          '& fieldset': {
            borderWidth:'0.5px !important'
          },
          '&:hover fieldset': {
            borderWidth:'1px !important'
          },
          '&.Mui-focused fieldset': {
            borderWidth:'1px !important'
          }
        }
      }
    }
  }
})

export default theme