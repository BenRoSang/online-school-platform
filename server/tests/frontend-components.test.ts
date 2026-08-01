import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { CourseForm } from '../../src/components/forms/CourseForm.tsx'
import { LessonForm } from '../../src/components/forms/LessonForm.tsx'
import { ConfirmationDialog } from '../../src/components/common/ConfirmationDialog.tsx'

describe('critical form components', () => {
  it('renders every course field and prevents submission while saving', () => {
    const markup = renderToStaticMarkup(createElement(CourseForm, {
      submitLabel: 'Create course',
      isSubmitting: true,
      onSubmit: vi.fn(),
    }))
    expect(markup).toContain('name="title"')
    expect(markup).toContain('name="slug"')
    expect(markup).toContain('name="description"')
    expect(markup).toContain('name="thumbnailUrl"')
    expect(markup).toContain('name="status"')
    expect(markup).toContain('disabled=""')
    expect(markup).toContain('Saving…')
  })

  it('renders lesson validation fields and a disabled saving state', () => {
    const markup = renderToStaticMarkup(createElement(LessonForm, {
      busy: true,
      onCancel: vi.fn(),
      onSubmit: vi.fn(),
    }))
    expect(markup).toContain('name="title"')
    expect(markup).toContain('name="description"')
    expect(markup).toContain('name="youtubeVideoId"')
    expect(markup).toContain('name="isPreview"')
    expect(markup).toContain('disabled=""')
  })

  it('exposes an accessible destructive confirmation state', () => {
    const markup = renderToStaticMarkup(createElement(ConfirmationDialog, {
      open: true,
      title: 'Delete course?',
      description: 'This cannot be undone.',
      onCancel: vi.fn(),
      onConfirm: vi.fn(),
    }))
    expect(markup).toContain('role="alertdialog"')
    expect(markup).toContain('aria-modal="true"')
    expect(markup).toContain('Cancel')
    expect(markup).toContain('Confirm')
  })
})
