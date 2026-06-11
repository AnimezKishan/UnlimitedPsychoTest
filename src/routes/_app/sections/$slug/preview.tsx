import { createFileRoute } from '@tanstack/react-router'
import { PreviewPageSkeleton } from '#/components/common/skeletons'
import { SectionPreviewView } from '#/views/tests/SectionPreviewView'

export const Route = createFileRoute('/_app/sections/$slug/preview')({
  pendingComponent: PreviewPageSkeleton,
  component: SectionPreviewView,
})
