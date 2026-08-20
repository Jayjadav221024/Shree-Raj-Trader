import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  Loader2,
  Monitor,
  Pencil,
  Plus,
  RotateCcw,
  Smartphone,
  Tablet,
  Trash2,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../lib/axios';
import AdminLayout from '../components/AdminLayout';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ActiveToggle from '../components/ActiveToggle';
import ImageUploadInput from '../components/ImageUploadInput';
import DynamicIcon from '../components/DynamicIcon';
import { SECTIONS, SECTION_PAGES, clone } from '../../data/sectionRegistry';
import { EDITOR_MESSAGE_SOURCE } from '../../components/SectionEditOverlay';

const MENU_ROUTE = '/admin/website/editor';

const DEVICES = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: '820px' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '390px' },
];

const inputClass =
  'w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text';

/** Groups a section's fields under their optional `group` heading, order preserved. */
const groupFields = (fields = []) => {
  const groups = [];
  fields.forEach((field) => {
    const name = field.group || '';
    let bucket = groups.find((g) => g.name === name);
    if (!bucket) {
      bucket = { name, fields: [] };
      groups.push(bucket);
    }
    bucket.fields.push(field);
  });
  return groups;
};

/** A single scalar field (everything except lists). */
function FieldInput({ field, value, onChange }) {
  if (field.type === 'boolean') {
    return (
      <div className="pt-1">
        <ActiveToggle value={Boolean(value)} onChange={onChange} label={field.label} />
        {field.help && <p className="mt-1.5 text-[11px] text-adm-faint">{field.help}</p>}
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <div className="pt-1">
        <ImageUploadInput
          label={field.label}
          value={value || ''}
          onChange={onChange}
          group={field.imageGroup || 'site'}
        />
        {field.help && <p className="mt-1.5 text-[11px] text-adm-faint">{field.help}</p>}
      </div>
    );
  }

  const isLong = field.type === 'textarea' || field.type === 'html';

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wide text-adm-muted">
        {field.label}
      </label>
      {isLong ? (
        <textarea
          rows={field.type === 'html' ? 8 : 3}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} resize-y ${field.type === 'html' ? 'font-mono text-xs' : ''}`}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
      {field.help && <p className="text-[11px] text-adm-faint">{field.help}</p>}
    </div>
  );
}

/** Repeating rows — brands, milestones, footer links, team members, and so on. */
function ListField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [openIndex, setOpenIndex] = useState(0);

  const updateItem = (index, key, next) => {
    const copyItems = items.map((item, i) => (i === index ? { ...item, [key]: next } : item));
    onChange(copyItems);
  };

  const addItem = () => {
    const blank = {};
    field.itemFields.forEach((f) => {
      blank[f.key] = f.type === 'boolean' ? false : f.type === 'list' ? [] : '';
    });
    onChange([...items, blank]);
    setOpenIndex(items.length);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(-1);
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex(target);
  };

  // The first text-ish value makes a far better row title than "Item 3".
  const titleOf = (item, index) => {
    const firstText = field.itemFields.find((f) => f.type === 'text' || f.type === 'textarea');
    const label = firstText ? item?.[firstText.key] : '';
    return label || `${field.itemLabel || 'Item'} ${index + 1}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-xs font-bold uppercase tracking-wide text-adm-muted">
          {field.label}
          <span className="ml-2 font-medium normal-case text-adm-faint">({items.length})</span>
        </label>
        {!field.fixedLength && (
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-adm-primary/25 bg-adm-primary-soft px-2.5 py-1.5 text-xs font-semibold text-adm-primary transition-colors hover:bg-adm-primary hover:text-adm-primary-fg"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {field.itemLabel || 'item'}
          </button>
        )}
      </div>

      {field.help && <p className="text-[11px] text-adm-faint">{field.help}</p>}

      <div className="space-y-2">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="overflow-hidden rounded-xl border border-adm-line bg-adm-surface-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-adm-faint" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-adm-faint" />
                  )}
                  <span className="truncate text-sm font-semibold text-adm-text">
                    {titleOf(item, index)}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                    className="rounded p-1 text-adm-faint transition-colors hover:bg-adm-surface-3 hover:text-adm-text disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    title="Move down"
                    className="rounded p-1 text-adm-faint transition-colors hover:bg-adm-surface-3 hover:text-adm-text disabled:opacity-30"
                  >
                    ↓
                  </button>
                  {!field.fixedLength && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      title="Remove"
                      className="rounded p-1 text-adm-faint transition-colors hover:bg-adm-danger-soft hover:text-adm-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="space-y-4 border-t border-adm-line bg-adm-surface px-3 py-4">
                  {field.itemFields.map((itemField) =>
                    itemField.type === 'list' ? (
                      <ListField
                        key={itemField.key}
                        field={itemField}
                        value={item?.[itemField.key]}
                        onChange={(next) => updateItem(index, itemField.key, next)}
                      />
                    ) : (
                      <FieldInput
                        key={itemField.key}
                        field={itemField}
                        value={item?.[itemField.key]}
                        onChange={(next) => updateItem(index, itemField.key, next)}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-adm-line-strong px-3 py-6 text-center text-xs text-adm-faint">
            Nothing here yet. This block will be hidden on the website.
          </p>
        )}
      </div>
    </div>
  );
}

export default function WebsiteEditor() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { permittedMenus, permissions, user } = useAuthStore();

  const [activePage, setActivePage] = useState(SECTION_PAGES[1]?.id || 'home');
  const [device, setDevice] = useState('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [resetTarget, setResetTarget] = useState(null);
  const [renderedSections, setRenderedSections] = useState([]);
  const iframeRef = useRef(null);

  const permissionsForScreen = useMemo(() => {
    const menu = permittedMenus.find((m) => m.route === MENU_ROUTE);
    const rolePerm = permissions.find((p) => p.menuId === menu?._id);
    const isSuper = user?.role === 'Super Admin';
    return {
      canEdit: Boolean(rolePerm?.canEdit) || isSuper,
      canDelete: Boolean(rolePerm?.canDelete) || isSuper,
    };
  }, [permittedMenus, permissions, user]);

  const { data, isLoading } = useQuery({
    queryKey: ['site-sections'],
    queryFn: async () => {
      const res = await api.get('/site-sections');
      return res.data.data;
    },
  });

  const overrides = data?.overrides || {};
  const meta = data?.meta || {};

  const currentPage = SECTION_PAGES.find((p) => p.id === activePage) || SECTION_PAGES[0];
  const pageSections = useMemo(() => SECTIONS.filter((s) => s.page === activePage), [activePage]);
  const editingSection = editingId ? SECTIONS.find((s) => s.id === editingId) : null;

  const previewSrc = `${currentPage.route}?srtEdit=1&v=${previewKey}`;

  // Depends on `data`, not the derived `overrides` object, which is a fresh
  // literal on every render and would re-create this callback each pass.
  const openEditor = useCallback(
    (sectionId) => {
      const section = SECTIONS.find((s) => s.id === sectionId);
      if (!section || section.fields.length === 0) return;
      const saved = data?.overrides?.[sectionId] || {};
      setFormData({ ...clone(section.defaults), ...clone(saved) });
      setEditingId(sectionId);
    },
    [data],
  );

  // Point the preview at the section and open its form.
  const focusSection = (sectionId) => {
    iframeRef.current?.contentWindow?.postMessage(
      { source: EDITOR_MESSAGE_SOURCE, type: 'highlight-section', sectionId },
      '*',
    );
    openEditor(sectionId);
  };

  // "Edit" pressed inside the preview.
  useEffect(() => {
    const handleMessage = (event) => {
      const payload = event.data;
      if (!payload || payload.source !== EDITOR_MESSAGE_SOURCE) return;
      if (payload.type === 'edit-section') openEditor(payload.sectionId);
      if (payload.type === 'page-ready') setRenderedSections(payload.sections || []);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [openEditor]);

  const saveMutation = useMutation({
    mutationFn: ({ key, values }) => api.put(`/site-sections/${key}`, { data: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-sections'] });
      addToast('Section saved — the website has been updated', 'success');
      setEditingId(null);
      setPreviewKey((k) => k + 1);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Could not save this section', 'error');
    },
  });

  const resetMutation = useMutation({
    mutationFn: (key) => api.delete(`/site-sections/${key}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-sections'] });
      addToast('Section restored to its original content', 'success');
      setResetTarget(null);
      setEditingId(null);
      setPreviewKey((k) => k + 1);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Could not reset this section', 'error');
    },
  });

  const editedCount = SECTIONS.filter((s) => overrides[s.id]).length;

  const setField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({ key: editingId, values: formData });
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Website Editor"
        subtitle="Open a page, hover any part of it and press Edit. Every block on the public website is listed here, so nothing can be left unmaintained."
        breadcrumbs={[{ label: 'Website' }, { label: 'Website Editor' }]}
        action={
          <a
            href={currentPage.route}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-adm-line px-4 py-2.5 text-sm font-semibold text-adm-text transition-colors hover:bg-adm-surface-3"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open live page</span>
          </a>
        }
      />

      {/* Page picker */}
      <div className="admin-scroll mb-5 flex items-center gap-2 overflow-x-auto pb-1">
        {SECTION_PAGES.map((page) => {
          const count = SECTIONS.filter((s) => s.page === page.id).length;
          const isActive = page.id === activePage;
          return (
            <button
              key={page.id}
              onClick={() => {
                setActivePage(page.id);
                setRenderedSections([]);
              }}
              className={`shrink-0 rounded-lg border px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                isActive
                  ? 'border-adm-primary bg-adm-primary text-adm-primary-fg'
                  : 'border-adm-line bg-adm-surface text-adm-muted hover:border-adm-primary hover:text-adm-primary'
              }`}
            >
              {page.label}
              <span className={`ml-2 font-medium ${isActive ? 'opacity-80' : 'text-adm-faint'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Section list */}
        <div className="xl:col-span-4">
          <div className="rounded-2xl border border-adm-line bg-adm-surface shadow-adm-sm">
            <div className="border-b border-adm-line px-4 py-3.5">
              <h2 className="text-sm font-semibold tracking-tight text-adm-text">
                Sections on {currentPage.label}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-adm-muted">{currentPage.description}</p>
              <p className="mt-2 text-[11px] text-adm-faint">
                {editedCount} of {SECTIONS.length} sections across the site have been edited.
              </p>
            </div>

            <div className="admin-scroll max-h-[62vh] divide-y divide-adm-line-soft overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-adm-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading sections…
                </div>
              )}

              {!isLoading &&
                pageSections.map((section) => {
                  const isEdited = Boolean(overrides[section.id]);
                  const info = meta[section.id];
                  const isEditable = section.fields.length > 0 && permissionsForScreen.canEdit;
                  // Cross-cutting sections have no block of their own and are
                  // located through their anchor instead — not a gap.
                  const notOnPage =
                    renderedSections.length > 0 &&
                    !renderedSections.includes(section.id) &&
                    !renderedSections.includes(section.anchor);

                  return (
                    <div key={section.id} className="px-4 py-3.5 transition-colors hover:bg-adm-surface-2">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-adm-primary-soft text-adm-primary">
                          <DynamicIcon name={section.icon || 'Square'} className="h-4 w-4" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-adm-text">{section.label}</span>
                            {isEdited && (
                              <span className="rounded-full bg-adm-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-adm-success">
                                Edited
                              </span>
                            )}
                            {section.managedBy && (
                              <span className="rounded-full bg-adm-surface-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-adm-muted">
                                Database
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-relaxed text-adm-muted">
                            {section.description}
                          </p>

                          {section.managedBy && (
                            <p className="mt-1.5 text-xs text-adm-muted">
                              {section.managedByNote || 'This content is managed as database records.'}{' '}
                              <Link
                                to={section.managedBy.to}
                                className="font-semibold text-adm-primary hover:underline"
                              >
                                Open {section.managedBy.label} →
                              </Link>
                            </p>
                          )}

                          {info?.updatedByName && (
                            <p className="mt-1.5 text-[11px] text-adm-faint">
                              Last edited by {info.updatedByName}
                              {info.updatedAt ? ` on ${new Date(info.updatedAt).toLocaleString()}` : ''}
                            </p>
                          )}

                          {notOnPage && (
                            <p className="mt-1.5 text-[11px] text-adm-warning">
                              Not visible on the preview above — it may sit further down or on another view.
                            </p>
                          )}

                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => focusSection(section.id)}
                              disabled={!isEditable}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-adm-primary px-3 py-1.5 text-xs font-semibold text-adm-primary-fg transition-colors hover:bg-adm-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                iframeRef.current?.contentWindow?.postMessage(
                                  {
                                    source: EDITOR_MESSAGE_SOURCE,
                                    type: 'highlight-section',
                                    sectionId: section.id,
                                  },
                                  '*',
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-adm-line px-3 py-1.5 text-xs font-semibold text-adm-muted transition-colors hover:text-adm-text"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Show me
                            </button>

                            {isEdited && permissionsForScreen.canDelete && (
                              <button
                                onClick={() => setResetTarget(section)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-adm-muted transition-colors hover:bg-adm-danger-soft hover:text-adm-danger"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Undo my changes
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="xl:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-adm-line bg-adm-surface shadow-adm-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-adm-line bg-adm-surface-2 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                {DEVICES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDevice(d.id)}
                    title={d.label}
                    className={`rounded-lg p-2 transition-colors ${
                      device === d.id
                        ? 'bg-adm-primary text-adm-primary-fg'
                        : 'text-adm-faint hover:bg-adm-surface-3 hover:text-adm-text'
                    }`}
                  >
                    <d.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              <span className="truncate font-mono text-[11px] text-adm-faint">{currentPage.route}</span>

              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-adm-line px-2.5 py-1.5 text-xs font-semibold text-adm-muted transition-colors hover:text-adm-text"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            <div className="flex justify-center bg-adm-surface-3 p-3">
              <iframe
                key={previewSrc}
                ref={iframeRef}
                src={previewSrc}
                title="Website preview"
                className="h-[70vh] rounded-xl border border-adm-line bg-white shadow-adm-sm"
                style={{ width: DEVICES.find((d) => d.id === device)?.width || '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section form */}
      {editingSection && (
        <Modal
          isOpen={Boolean(editingSection)}
          onClose={() => setEditingId(null)}
          title={`Edit: ${editingSection.label}`}
          description={editingSection.description}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {editingSection.intro && (
              <p className="rounded-lg border border-adm-line bg-adm-surface-2 px-3 py-2.5 text-xs leading-relaxed text-adm-muted">
                {editingSection.intro}
              </p>
            )}

            {groupFields(editingSection.fields).map((group) => (
              <div key={group.name || 'main'} className="space-y-4">
                {group.name && (
                  <h4 className="border-b border-adm-line-soft pb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-adm-faint">
                    {group.name}
                  </h4>
                )}
                {group.fields.map((field) =>
                  field.type === 'list' ? (
                    <ListField
                      key={field.key}
                      field={field}
                      value={formData[field.key]}
                      onChange={(next) => setField(field.key, next)}
                    />
                  ) : (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={formData[field.key]}
                      onChange={(next) => setField(field.key, next)}
                    />
                  ),
                )}
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 border-t border-adm-line-soft pt-4">
              {overrides[editingSection.id] && permissionsForScreen.canDelete ? (
                <button
                  type="button"
                  onClick={() => setResetTarget(editingSection)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-adm-muted transition-colors hover:bg-adm-danger-soft hover:text-adm-danger"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore original
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-adm-line px-4 py-2 text-sm font-semibold transition-colors hover:bg-adm-surface-3"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-adm-primary px-5 py-2 text-sm font-semibold text-adm-primary-fg shadow-adm-sm transition-colors hover:bg-adm-primary-hover disabled:opacity-60"
                >
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Publish changes
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={Boolean(resetTarget)}
        onClose={() => setResetTarget(null)}
        onConfirm={() => resetTarget && resetMutation.mutate(resetTarget.id)}
        title="Restore original content"
        message={`This removes every edit made to "${resetTarget?.label}" and puts back the text and images the site shipped with. Are you sure?`}
        isLoading={resetMutation.isPending}
      />
    </AdminLayout>
  );
}
