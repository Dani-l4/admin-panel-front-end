import React, { useEffect, useMemo, useState } from 'react'
import { useResourceContext } from '../context/ResourceContext'
import { useAuthContext } from '../context/AuthContext'
import { iUser } from '../types'
import TableToolbar from '../components/TableToolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Order } from '../types'
import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material'
import TableHeader from '../components/TableHeader'
import showErrorMessage from '../utils/showErrorMessage'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

export default function Users() {
    const { getUsers, blockUsers, unBlockUsers, deleteUsers } =
        useResourceContext()
    const { handleLogOut, currentUser } = useAuthContext()
    const [users, setUsers] = useState<iUser[]>([])
    const [order, setOrder] = React.useState<Order>('asc')
    const [orderBy, setOrderBy] = React.useState<keyof iUser>('id')
    const [selected, setSelected] = React.useState<readonly number[]>([])

    const handleRequestSort = (
        _: React.MouseEvent<unknown>,
        property: keyof iUser
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
        setSelected([])
    }

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = users.map((_, idx) => idx)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (_: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: readonly number[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            )
        }
        setSelected(newSelected)
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1

    const fetchNSetUsers = async () => {
        setSelected([])
        setUsers(await getUsers())
    }

    useEffect(() => {
        fetchNSetUsers()
    }, [])

    const getSelectedUserIds = (selected: readonly number[]): string[] => {
        return selected.map((index) => users[index].id)
    }

    const handleBlock = (e: React.MouseEvent) => {
        e.preventDefault()
        ;(async () => {
            try {
                const usersIds = getSelectedUserIds(selected)
                const res = await blockUsers(usersIds)
                if (res.data.redirect) {
                    return (window.location.href = '/sign-in')
                }
                await fetchNSetUsers()
            } catch (error: any) {
                if (error.code === 'ERR_BAD_REQUEST') {
                    showErrorMessage(error)
                    window.location.href = '/sign-in'
                }
            }
        })()
        return
    }

    const handleUnBlock = (e: React.MouseEvent) => {
        e.preventDefault()
        ;(async () => {
            try {
                const usersIds = getSelectedUserIds(selected)
                await unBlockUsers(usersIds)
                await fetchNSetUsers()
            } catch (error) {
                showErrorMessage(error)
            }
        })()
        return
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        ;(async () => {
            try {
                const usersIds = getSelectedUserIds(selected)
                await deleteUsers(usersIds)
                await fetchNSetUsers()
            } catch (error) {
                showErrorMessage(error)
            }
        })()
        return
    }

    useMemo(() => {
        setUsers(users.slice().sort(getComparator(order, orderBy)))
    }, [order, orderBy])

    return (
        <>
            <Box
                component='header'
                sx={{
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2,
                }}
            >
                <Typography component='h4' marginRight={2} alignSelf={'center'}>
                    Hello {currentUser}
                </Typography>
                <Button onClick={handleLogOut} variant='contained'>
                    log out
                </Button>
            </Box>
            <Box sx={{ width: '100%' }}>
                <TableToolbar
                    btnsDisabled={!selected.length}
                    onBlock={handleBlock}
                    onUnBlock={handleUnBlock}
                    onDelete={handleDelete}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby='tableTitle'
                        size='medium'
                    >
                        <TableHeader
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={users.length}
                        />
                        <TableBody>
                            {users.map((user, index) => {
                                const isItemSelected = isSelected(index)
                                const labelId = `table-checkbox-${index}`

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) =>
                                            handleClick(event, index)
                                        }
                                        role='checkbox'
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={user.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding='checkbox'>
                                            <Checkbox
                                                color='primary'
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component='th'
                                            id={labelId}
                                            scope='row'
                                            padding='none'
                                        >
                                            {user.id}
                                        </TableCell>
                                        <TableCell align='left'>
                                            {user.name}
                                        </TableCell>
                                        <TableCell align='left'>
                                            {user.email}
                                        </TableCell>
                                        <TableCell align='left'>
                                            {user.createdAt}
                                        </TableCell>
                                        <TableCell align='left'>
                                            {user.lastLogin}
                                        </TableCell>
                                        <TableCell align='left'>
                                            {user.status}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}
