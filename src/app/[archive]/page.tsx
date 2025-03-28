'use client'
import { Archive, ArchiveCategory, ArchivePic } from "@/components/display/archive"
import { EditDetailbyId } from "@/components/display/detail"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { UserType } from "@/redux/reducer/UserReduce"
import store from "@/redux/store"
const Page = () => {
    const params = useParams<{ archive: string }>()
    const archive = params.archive

    const [currentUser, setCurrentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => setCurrentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    })
    switch (archive) {
        case "pic":
            return <ArchivePic />
        case "category":
            return <ArchiveCategory />
        case "profile":
            return <EditDetailbyId archive="user" slug={currentUser.id.toString()} />
        default:
            return <Archive archive={archive} />
    }

}

export default Page