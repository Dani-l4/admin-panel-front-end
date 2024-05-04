import {
    TableHead,
    TableRow,
    TableCell,
    Checkbox,
    TableSortLabel,
    Box,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { Order, iUser } from '../types'

interface HeadCell {
    id: keyof iUser
    label: string
    numeric: boolean
}

const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        numeric: true,
        label: 'ID',
    },
    {
        id: 'name',
        numeric: true,
        label: 'Name',
    },
    {
        id: 'email',
        numeric: true,
        label: 'Email',
    },
    {
        id: 'createdAt',
        numeric: true,
        label: 'Registered',
    },
    {
        id: 'lastLogin',
        numeric: true,
        label: 'Last login',
    },
    {
        id: 'status',
        numeric: true,
        label: 'Status',
    },
]

interface EnhancedTableProps {
    numSelected: number
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof iUser
    ) => void
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
    order: Order
    orderBy: string
    rowCount: number
}

export default function TableHeader(props: EnhancedTableProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props
    const createSortHandler =
        (property: keyof iUser) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property)
        }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding='checkbox'>
                    <Checkbox
                        color='primary'
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align='left'
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component='span' sx={visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}
