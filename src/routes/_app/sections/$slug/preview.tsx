import { createFileRoute } from '@tanstack/react-router'
import { OddNumberPreviewView } from '#/views/tests/odd-number-counting/OddNumberPreviewView'

export const Route = createFileRoute('/_app/sections/$slug/preview')({
  component: OddNumberPreviewView,
})
