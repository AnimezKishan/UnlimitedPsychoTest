import { createFileRoute } from '@tanstack/react-router'
import { SectionsListView } from '#/views/tests/SectionsListView'

export const Route = createFileRoute('/_app/sections/')({
  component: SectionsListView,
})
