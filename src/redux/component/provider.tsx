'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import store from '../store'
import { ApiCheckLogin } from '@/api/user'
import { setUser, UserType } from '../reducer/UserReduce'
import Loading from '@/components/display/loading'
type Props = {
    children: React.ReactNode
}

const Provider = ({ children }: Props) => {
    const [currentRefresh, setCurrentRefresh] = useState<number>(store.getState().refresh)
    const update = () => {
        store.subscribe(() => setCurrentRefresh(store.getState().refresh))

    }
    useEffect(() => {
        update()
    })

    const [_loading, set_loading] = useState<boolean>(true)

    const isLogin = async () => {
        set_loading(true)
        try {
            const result = await ApiCheckLogin()
            if (result.success) {
                set_loading(false)
                store.dispatch(setUser(result.data))
            } else {
                set_loading(false)
                store.dispatch(setUser({} as UserType))
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            set_loading(false)
            store.dispatch(setUser({} as UserType))
        }

    }


    useEffect(() => {
        isLogin()
    }, [currentRefresh])

    return (
        _loading ? <Loading /> : children
    )
}

export default Provider