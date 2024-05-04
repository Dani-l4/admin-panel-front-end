import { IconButton, Toolbar, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'

interface TableToolbarProps {
    btnsDisabled: boolean
    onBlock: React.MouseEventHandler<HTMLButtonElement>
    onUnBlock: React.MouseEventHandler<HTMLButtonElement>
    onDelete: React.MouseEventHandler<HTMLButtonElement>
}
export default function TableToolbar(props: TableToolbarProps) {
    const { btnsDisabled, onBlock, onUnBlock, onDelete } = props

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: 'Menu',
            }}
        >
            <Tooltip title='Block'>
                <span>
                    <IconButton
                        disabled={btnsDisabled}
                        onClick={(e) => onBlock(e)}
                    >
                        <LockIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title='Unblock'>
                <span>
                    <IconButton
                        disabled={btnsDisabled}
                        onClick={(e) => onUnBlock(e)}
                    >
                        <LockOpenIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title='Delete'>
                <span>
                    <IconButton
                        disabled={btnsDisabled}
                        onClick={(e) => onDelete(e)}
                    >
                        <DeleteIcon color='error' />
                    </IconButton>
                </span>
            </Tooltip>
        </Toolbar>
    )
}
