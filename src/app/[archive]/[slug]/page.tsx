'use client'
import { EditDetailbyId, EditDetailbySlug } from '@/components/display/detail'
import { useParams } from 'next/navigation'

const Page = () => {
    const params = useParams<{ archive: string, slug: string }>()
    const archive = params.archive
    const slug = params.slug
    switch (archive) {
        case "user":
            return <EditDetailbyId archive={archive} slug={slug} />
        default:
            return <EditDetailbySlug archive={archive} slug={slug} />
    }

}

export default Page