import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Link, useLocation } from 'react-router-dom'

export default function CustomTabs() {
    const { pathname } = useLocation()
    let currentTab = ['/sign-in', '/sign-up'].includes(pathname)
        ? pathname
        : '/sign-in'
    const [tab, setTab] = useState(currentTab)

    const handleChange = (_: React.SyntheticEvent, newTab: string) => {
        setTab(newTab)
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    border: 1,
                    borderColor: 'divider',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '30%',
                    minWidth: '205px',
                }}
            >
                <Tabs
                    value={tab}
                    onChange={handleChange}
                    aria-label='tabs'
                    role='navigation'
                >
                    <Tab
                        label='Sign-In'
                        value='/sign-in'
                        to='/sign-in'
                        component={Link}
                    />
                    <Tab
                        label='Sign-Up'
                        value='/sign-up'
                        to='/sign-up'
                        component={Link}
                    />
                </Tabs>
            </Box>
        </Box>
    )
}
