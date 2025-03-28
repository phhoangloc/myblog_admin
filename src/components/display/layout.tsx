'use client'
import React, { useState, useEffect } from 'react'
import store from '@/redux/store'
import Header from './header'
import { UserType } from '@/redux/reducer/UserReduce'
import LoginCard from '../card/loginCard'
import { ApiLogin } from '@/api/client'
import { setNotice } from '@/redux/reducer/noticeReducer'
import { setRefresh } from '@/redux/reducer/RefreshReduce'
type Props = {
    sidebar: React.ReactNode
    children: React.ReactNode
}

const Layout = ({ children, sidebar }: Props) => {

    const [currentMenu, setCurrentMenu] = useState<boolean>(store.getState().menu)
    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentMenu(store.getState().menu))
        store.subscribe(() => setCurrentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    })
    const login = async (data: { username: string, password: string }) => {
        const result = await ApiLogin(data)
        if (result.success) {
            store.dispatch(setNotice({ success: result.success, msg: result.msg, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
                store.dispatch(setRefresh())
            }, 3000)
        } else {
            store.dispatch(setNotice({ success: result.success, msg: result.message, open: true }))
            setTimeout(() => {
                store.dispatch(setNotice({ success: result.success, msg: "", open: false }))
            }, 3000)
        }
    }

    return (
        currentUser.id ?
            <div className='bg-lv-1 dark:bg-lv-19 text-black dark:text-lv-0'>
                <div className="grid min-h-screen m-auto grid-cols-12 gap-2 p-2">
                    <div className={`fixed top-0 left-0 h-full  ${currentMenu ? "w-screen" : "w-0"} transition-all duration-300 delay-500 xl:w-full xl:col-span-2  xl:relative xl:h-auto z-10 `}>
                        {sidebar}
                    </div>
                    <div className='w-full col-span-12  xl:col-span-10 relative rounded'>
                        <Header></Header>
                        {children}
                    </div>
                </div >
            </div > :
            <div className='bg-lv-1 dark:bg-lv-19 text-black dark:text-lv-0 h-screen flex flex-col justify-center'>
                <LoginCard login={(body) => login(body)} />
            </div>
    )
}

export default Layout
