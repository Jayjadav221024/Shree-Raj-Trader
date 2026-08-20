import React, { useState, useEffect } from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import api from '../lib/axios';
import AdminLayout from '../components/AdminLayout';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ActiveToggle from '../components/ActiveToggle';
import ImageUploadInput from '../components/ImageUploadInput';
import { resolveImageUrl } from '../lib/imageResolver';
import { Plus, Loader2, FileQuestion, ArrowLeft } from 'lucide-react';

const MasterImageCell = ({ imageKey, group = 'products', alt = '' }) => {
  const resolved = resolveImageUrl(imageKey, group);
  return (
    <div className="w-11 h-11 rounded-lg border border-adm-line bg-adm-surface p-1 flex items-center justify-center overflow-hidden shrink-0">
      {resolved?.src ? (
        <img
          src={resolved.src}
          alt={alt}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.opacity = '0.3';
          }}
        />
      ) : (
        <span className="text-[10px] text-adm-faint">No img</span>
      )}
    </div>
  );
};

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/** Uploaded files are served by the API, not the site, so they need its origin. */
const resolveDocumentUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${BACKEND_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      isActive ? 'bg-adm-success-soft text-adm-success' : 'bg-adm-danger-soft text-adm-danger'
    }`}
  >
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

export default function GenericMasters() {
  const { module: moduleKey } = useParams();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { permittedMenus, permissions, user } = useAuthStore();

  const activePermissions = React.useMemo(() => {
    const routePath = `/admin/master/${moduleKey}`;
    const currentMenu = permittedMenus.find((m) => m.route === routePath);
    const rolePerm = permissions.find((p) => p.menuId === currentMenu?._id);
    const isSuper = user?.role === 'Super Admin';
    return {
      canView: rolePerm?.canView || isSuper,
      canCreate: rolePerm?.canCreate || isSuper,
      canEdit: rolePerm?.canEdit || isSuper,
      canDelete: rolePerm?.canDelete || isSuper,
    };
  }, [permittedMenus, permissions, user, moduleKey]);

  // Static lookup — memoised so`currentConfig`keeps a stable identity across
  // renders and downstream memos are not invalidated on every pass.
  const configs = React.useMemo(
    () => ({
      country: {
        title: 'Countries Master',
        apiEndpoint: '/countries',
        searchFields: ['name', 'code'],
        columns: [
          {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          { accessorKey: 'code', header: 'Code' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'name', label: 'Country Name', type: 'text', required: true },
          { key: 'code', label: 'Country Code (e.g. IN, US)', type: 'text', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      state: {
        title: 'States Master',
        apiEndpoint: '/states',
        searchFields: ['name'],
        columns: [
          {
            accessorKey: 'name',
            header: 'State Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          {
            id: 'country',
            header: 'Country',
            cell: ({ row }) => <span>{row.original.countryId?.name || 'N/A'}</span>,
          },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          {
            key: 'countryId',
            label: 'Country',
            type: 'select',
            optionsEndpoint: '/countries?limit=100&isActive=true',
            optionsQueryKey: 'countries-select',
            required: true,
          },
          { key: 'name', label: 'State Name', type: 'text', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      city: {
        title: 'Cities Master',
        apiEndpoint: '/cities',
        searchFields: ['name'],
        columns: [
          {
            accessorKey: 'name',
            header: 'City Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          {
            id: 'state',
            header: 'State',
            cell: ({ row }) => <span>{row.original.stateId?.name || 'N/A'}</span>,
          },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          {
            key: 'countryId',
            label: 'Filter Country',
            type: 'select',
            optionsEndpoint: '/countries?limit=100&isActive=true',
            optionsQueryKey: 'countries-select',
            required: false,
            cascadeResetField: 'stateId',
          },
          {
            key: 'stateId',
            label: 'State',
            type: 'select',
            optionsEndpoint: '/states?limit=100&isActive=true',
            optionsQueryKey: 'states-select',
            required: true,
            dependsOn: 'countryId',
          },
          { key: 'name', label: 'City Name', type: 'text', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      currency: {
        title: 'Currencies Master',
        apiEndpoint: '/currencies',
        searchFields: ['name', 'code', 'symbol'],
        columns: [
          {
            accessorKey: 'name',
            header: 'Currency Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          { accessorKey: 'code', header: 'Code' },
          { accessorKey: 'symbol', header: 'Symbol' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'name', label: 'Currency Name', type: 'text', required: true },
          { key: 'code', label: 'Code (e.g. INR, USD)', type: 'text', required: true },
          { key: 'symbol', label: 'Symbol (e.g. ₹, $)', type: 'text', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      role: {
        title: 'Role Master',
        apiEndpoint: '/roles',
        searchFields: ['name', 'description'],
        columns: [
          {
            accessorKey: 'name',
            header: 'Role Name',
            cell: ({ row }) => <span className="font-semibold text-adm-primary">{row.original.name}</span>,
          },
          { accessorKey: 'description', header: 'Description' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'name', label: 'Role Name', type: 'text', required: true },
          { key: 'description', label: 'Role Description', type: 'text', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      'menu-group': {
        title: 'Menu Groups Master',
        apiEndpoint: '/menu-groups',
        searchFields: ['name'],
        columns: [
          {
            accessorKey: 'name',
            header: 'Group Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          { accessorKey: 'order', header: 'Sort Sequence' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'name', label: 'Group Name', type: 'text', required: true },
          { key: 'order', label: 'Sort Sequence Order', type: 'number', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      'menu-master': {
        title: 'Menu Master Configuration',
        apiEndpoint: '/menu-master',
        searchFields: ['label', 'route'],
        columns: [
          {
            accessorKey: 'label',
            header: 'Menu Label',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.label}</span>,
          },
          { accessorKey: 'route', header: 'Route Slug' },
          { accessorKey: 'icon', header: 'Icon String' },
          {
            id: 'group',
            header: 'Group',
            cell: ({ row }) => <span>{row.original.menuGroupId?.name || 'N/A'}</span>,
          },
          {
            id: 'parent',
            header: 'Parent Menu',
            cell: ({ row }) => <span>{row.original.parentId?.label || 'Root Level'}</span>,
          },
          { accessorKey: 'order', header: 'Sort Order' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          {
            key: 'menuGroupId',
            label: 'Menu Group Section',
            type: 'select',
            optionsEndpoint: '/menu-groups?limit=100&isActive=true',
            optionsQueryKey: 'menugroups-select',
            required: true,
          },
          {
            key: 'parentId',
            label: 'Parent Nesting (Optional)',
            type: 'select',
            optionsEndpoint: '/menu-master?limit=200&isActive=true',
            optionsQueryKey: 'menuparent-select',
            required: false,
          },
          { key: 'label', label: 'Menu Label Name', type: 'text', required: true },
          { key: 'icon', label: 'Lucide Icon String Name (e.g. Users, Mail)', type: 'text', required: true },
          { key: 'route', label: 'Route Link Path (e.g. /setup/admin-users)', type: 'text', required: true },
          { key: 'order', label: 'Sort Sequence', type: 'number', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      'login-logs': {
        title: 'Login Attempt History Logs',
        apiEndpoint: '/login-logs',
        searchFields: ['email', 'ip', 'userAgent', 'status'],
        columns: [
          {
            accessorKey: 'email',
            header: 'Account Email',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.email}</span>,
          },
          { accessorKey: 'ip', header: 'IP Address' },
          {
            accessorKey: 'userAgent',
            header: 'User Agent Strings',
            cell: ({ row }) => (
              <span className="text-xs truncate max-w-xs block" title={row.original.userAgent}>
                {row.original.userAgent}
              </span>
            ),
          },
          {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${row.original.status === 'success' ? 'bg-adm-success-soft text-adm-success' : 'bg-adm-danger-soft text-adm-danger'}`}
              >
                {row.original.status}
              </span>
            ),
          },
          {
            accessorKey: 'timestamp',
            header: 'Attempt Timestamp',
            cell: ({ row }) => <span>{new Date(row.original.timestamp).toLocaleString()}</span>,
          },
        ],
        fields: [],
        readOnly: true,
      },
      category: {
        title: 'Categories Master',
        apiEndpoint: '/categories-master',
        searchFields: ['id', 'title', 'badge', 'description'],
        columns: [
          {
            accessorKey: 'imageKey',
            header: 'Image',
            cell: ({ row }) => (
              <MasterImageCell imageKey={row.original.imageKey} group="products" alt={row.original.title} />
            ),
          },
          {
            accessorKey: 'title',
            header: 'Category Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.title}</span>,
          },
          { accessorKey: 'id', header: 'Slug ID' },
          { accessorKey: 'badge', header: 'Badge Tag' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'title', label: 'Category Name', type: 'text', required: true },
          { key: 'id', label: 'Slug ID (e.g. switchgears)', type: 'text', required: true },
          { key: 'badge', label: 'Badge Tag (e.g. Siemens LV Distribution)', type: 'text', required: true },
          { key: 'description', label: 'Short Description', type: 'textarea', required: true },
          {
            key: 'imageKey',
            label: 'Category Banner Image',
            type: 'image',
            group: 'products',
            required: true,
          },
          {
            key: 'imageAlt',
            label: 'Image Alt Text (describes the picture for screen readers & Google)',
            type: 'text',
            required: false,
          },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      product: {
        title: 'Products Master',
        apiEndpoint: '/products-master',
        searchFields: ['slug', 'name', 'brand', 'categoryId'],
        columns: [
          {
            accessorKey: 'imageKey',
            header: 'Image',
            cell: ({ row }) => (
              <MasterImageCell imageKey={row.original.imageKey} group="products" alt={row.original.name} />
            ),
          },
          {
            accessorKey: 'name',
            header: 'Product Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          { accessorKey: 'brand', header: 'Brand Name' },
          { accessorKey: 'categoryId', header: 'Category Key' },
          { accessorKey: 'slug', header: 'Slug URL' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'name', label: 'Product Name', type: 'text', required: true },
          { key: 'slug', label: 'Slug URL (e.g. siemens-motor)', type: 'text', required: true },
          { key: 'brand', label: 'Brand (e.g. Siemens, CGL)', type: 'text', required: true },
          {
            key: 'categoryId',
            label: 'Category Group',
            type: 'select',
            optionsEndpoint: '/categories-master?limit=100&isActive=true',
            optionsQueryKey: 'categories-select',
            required: true,
          },
          { key: 'imageKey', label: 'Product Main Image', type: 'image', group: 'products', required: true },
          {
            key: 'imageAlt',
            label: 'Image Alt Text (describes the picture for screen readers & Google)',
            type: 'text',
            required: false,
          },
          { key: 'longDescription', label: 'Product Description Details', type: 'textarea', required: true },
          { key: 'applications', label: 'Applications (Comma separated)', type: 'text', required: false },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      testimonial: {
        title: 'Testimonials Master',
        apiEndpoint: '/testimonials-master',
        searchFields: ['client', 'company', 'feedback'],
        columns: [
          {
            accessorKey: 'client',
            header: 'Client / Representative',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.client}</span>,
          },
          { accessorKey: 'company', header: 'Company Name' },
          {
            accessorKey: 'feedback',
            header: 'Client Review Words',
            cell: ({ row }) => (
              <span className="text-xs truncate max-w-xs block" title={row.original.feedback}>
                {row.original.feedback}
              </span>
            ),
          },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'client', label: 'Client Representative Name', type: 'text', required: true },
          { key: 'company', label: 'Company Name', type: 'text', required: true },
          { key: 'feedback', label: 'Client Review Words', type: 'textarea', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      faq: {
        title: 'FAQs Master',
        apiEndpoint: '/faqs-master',
        searchFields: ['question', 'answer'],
        columns: [
          {
            accessorKey: 'question',
            header: 'Question',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.question}</span>,
          },
          { accessorKey: 'order', header: 'Display Sequence' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'question', label: 'FAQ Question', type: 'text', required: true },
          { key: 'answer', label: 'FAQ Answer details', type: 'textarea', required: true },
          { key: 'order', label: 'Display Order Sequence', type: 'number', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      blog: {
        title: 'Blogs Master',
        apiEndpoint: '/blogs-master',
        searchFields: ['title', 'slug', 'excerpt', 'author'],
        columns: [
          {
            accessorKey: 'imageKey',
            header: 'Image',
            cell: ({ row }) => (
              <MasterImageCell imageKey={row.original.imageKey} group="blog" alt={row.original.title} />
            ),
          },
          {
            accessorKey: 'title',
            header: 'Article Title',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.title}</span>,
          },
          { accessorKey: 'slug', header: 'Slug Path' },
          { accessorKey: 'author', header: 'Author' },
          { accessorKey: 'date', header: 'Publish Date' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'title', label: 'Article Title', type: 'text', required: true },
          {
            key: 'slug',
            label: 'Slug Path URL (e.g. smart-switchgear-trends)',
            type: 'text',
            required: true,
          },
          { key: 'imageKey', label: 'Featured Hero Image', type: 'image', group: 'blog', required: true },
          {
            key: 'imageAlt',
            label: 'Image Alt Text (describes the picture for screen readers & Google)',
            type: 'text',
            required: false,
          },
          { key: 'excerpt', label: 'Short Summary Excerpt', type: 'textarea', required: true },
          { key: 'content', label: 'Rich HTML / Body Content', type: 'textarea', required: true },
          { key: 'author', label: 'Author Name', type: 'text', required: true },
          { key: 'date', label: 'Publish Date (YYYY-MM-DD)', type: 'text', required: true },
          { key: 'readTime', label: 'Read Time (e.g. 5 min read)', type: 'text', required: true },
          { key: 'isActive', label: 'Is Active', type: 'boolean' },
        ],
      },
      'job-opening': {
        title: 'Job Openings',
        apiEndpoint: '/job-openings',
        searchFields: ['title', 'department', 'location', 'employmentType'],
        columns: [
          {
            accessorKey: 'title',
            header: 'Role',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.title}</span>,
          },
          { accessorKey: 'department', header: 'Department' },
          { accessorKey: 'location', header: 'Location' },
          { accessorKey: 'employmentType', header: 'Type' },
          { accessorKey: 'experience', header: 'Experience' },
          { accessorKey: 'order', header: 'Display Order' },
          {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
          },
        ],
        fields: [
          { key: 'title', label: 'Job Title', type: 'text', required: true },
          { key: 'department', label: 'Department (e.g. Sales, Warehouse)', type: 'text' },
          { key: 'location', label: 'Location (e.g. Vatva, Ahmedabad)', type: 'text' },
          {
            key: 'employmentType',
            label: 'Employment Type (Full-time, Part-time, Contract, Internship)',
            type: 'text',
          },
          { key: 'experience', label: 'Experience Required (e.g. 2-4 years)', type: 'text' },
          { key: 'description', label: 'Role Summary', type: 'textarea' },
          {
            key: 'responsibilities',
            label: 'Responsibilities (one per line)',
            type: 'lines',
          },
          {
            key: 'requirements',
            label: 'Requirements (one per line)',
            type: 'lines',
          },
          { key: 'order', label: 'Display Order Sequence', type: 'number', required: true },
          { key: 'isActive', label: 'Show on the careers page', type: 'boolean' },
        ],
      },
      'job-application': {
        title: 'Job Applications',
        apiEndpoint: '/job-applications',
        searchFields: ['name', 'email', 'phone', 'position', 'status'],
        columns: [
          {
            accessorKey: 'name',
            header: 'Applicant',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          { accessorKey: 'position', header: 'Applying For' },
          { accessorKey: 'email', header: 'Email' },
          { accessorKey: 'phone', header: 'Phone' },
          { accessorKey: 'experience', header: 'Experience' },
          {
            accessorKey: 'resumeUrl',
            header: 'CV',
            cell: ({ row }) =>
              row.original.resumeUrl ? (
                <a
                  href={resolveDocumentUrl(row.original.resumeUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-adm-primary hover:underline"
                >
                  Open CV
                </a>
              ) : (
                <span className="text-adm-faint">—</span>
              ),
          },
          {
            accessorKey: 'message',
            header: 'Message',
            cell: ({ row }) => (
              <span className="block max-w-xs truncate text-xs" title={row.original.message}>
                {row.original.message}
              </span>
            ),
          },
          { accessorKey: 'status', header: 'Status' },
          {
            accessorKey: 'createdAt',
            header: 'Received',
            cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleString()}</span>,
          },
        ],
        // Applications arrive from the public form; only the review status is editable.
        fields: [
          {
            key: 'status',
            label: 'Review Status (e.g. New, Shortlisted, Interviewed, Rejected, Hired)',
            type: 'text',
            required: true,
          },
        ],
        createDisabled: true,
      },
      inquiry: {
        title: 'Contact & RFQ Inquiries',
        apiEndpoint: '/inquiries-master',
        searchFields: ['name', 'email', 'company', 'productName'],
        columns: [
          {
            accessorKey: 'name',
            header: 'Lead Name',
            cell: ({ row }) => <span className="font-semibold text-adm-text">{row.original.name}</span>,
          },
          { accessorKey: 'email', header: 'Email Address' },
          { accessorKey: 'phone', header: 'Phone Number' },
          { accessorKey: 'company', header: 'Company' },
          { accessorKey: 'productName', header: 'Requested Item' },
          { accessorKey: 'quantity', header: 'Qty' },
          {
            accessorKey: 'message',
            header: 'Message details',
            cell: ({ row }) => (
              <span className="text-xs truncate max-w-xs block" title={row.original.message}>
                {row.original.message}
              </span>
            ),
          },
          {
            accessorKey: 'createdAt',
            header: 'Inquiry Date',
            cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleString()}</span>,
          },
        ],
        fields: [],
        readOnly: true,
      },
    }),
    [],
  );

  const currentConfig = configs[moduleKey];

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});

  // Switching modules reuses this same component instance (same`/admin/master/:module`
  // route), so every piece of per-module state has to be cleared by hand — otherwise a
  // record or half-filled form from the previous master leaks into the new screen.
  useEffect(() => {
    setPageIndex(1);
    setSearch('');
    setSorting([{ id: 'createdAt', desc: true }]);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedRecord(null);
    setFormData({});
  }, [moduleKey]);

  // Every module has a different number of dropdown-backed fields. These MUST be
  // loaded through a single`useQueries`hook: calling`useQuery`once per field
  // would change the hook count when the :module param changes without
  // remounting the component, which crashes the render ("rendered fewer hooks
  // than during the previous render") and blanks the screen.
  const selectFields = React.useMemo(
    () => (currentConfig?.fields || []).filter((f) => f.type === 'select' && f.optionsEndpoint),
    [currentConfig],
  );

  const dropdownQueries = useQueries({
    queries: selectFields.map((field) => ({
      queryKey: [field.optionsQueryKey || field.optionsEndpoint],
      queryFn: async () => {
        const res = await api.get(field.optionsEndpoint);
        return res.data.data;
      },
      staleTime: 5 * 60 * 1000,
    })),
  });

  const dropDownQueriesResults = React.useMemo(() => {
    const map = {};
    selectFields.forEach((field, i) => {
      map[field.key] = dropdownQueries[i]?.data;
    });
    return map;
  }, [selectFields, dropdownQueries]);

  const sortField = sorting[0]?.id || 'createdAt';
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

  const { data: listData, isLoading } = useQuery({
    queryKey: ['master-list', moduleKey, pageIndex, pageSize, search, sortField, sortOrder],
    queryFn: async () => {
      if (!currentConfig) return null;
      const res = await api.get(currentConfig.apiEndpoint, {
        params: {
          page: pageIndex,
          limit: pageSize,
          search,
          sortBy: sortField,
          order: sortOrder,
        },
      });
      return res.data;
    },
    enabled: !!currentConfig,
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post(currentConfig.apiEndpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-list', moduleKey] });
      addToast(`${currentConfig.title} record created successfully`, 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Record creation failed', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`${currentConfig.apiEndpoint}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-list', moduleKey] });
      addToast(`${currentConfig.title} record updated successfully`, 'success');
      closeForm();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Record update failed', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`${currentConfig.apiEndpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-list', moduleKey] });
      addToast(`${currentConfig.title} record deleted successfully`, 'success');
      setIsDeleteOpen(false);
      setSelectedRecord(null);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Record deletion failed', 'error');
    },
  });

  const handleOpenAdd = () => {
    setSelectedRecord(null);
    const initialForm = {};
    currentConfig.fields.forEach((field) => {
      initialForm[field.key] = field.type === 'boolean' ? true : field.type === 'number' ? 0 : '';
    });
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setSelectedRecord(rec);
    const editForm = {};
    currentConfig.fields.forEach((field) => {
      const val = rec[field.key];
      if (field.type === 'lines') {
        editForm[field.key] = Array.isArray(val) ? val.join('\n') : '';
        return;
      }
      editForm[field.key] = typeof val === 'object' && val !== null ? val._id : val;
    });
    setFormData(editForm);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (rec) => {
    setSelectedRecord(rec);
    setIsDeleteOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedRecord(null);
  };

  const handleFieldChange = (key, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };

      const currentField = currentConfig.fields.find((f) => f.key === key);
      if (currentField && currentField.cascadeResetField) {
        updated[currentField.cascadeResetField] = '';
      }
      return updated;
    });
  };

  const getFilteredOptions = (field) => {
    const rawOptions = dropDownQueriesResults[field.key] || [];
    if (field.dependsOn) {
      const parentValue = formData[field.dependsOn];
      if (!parentValue) return [];

      return rawOptions.filter((opt) => {
        const checkId = opt.countryId?._id || opt.countryId;
        return checkId === parentValue;
      });
    }
    return rawOptions;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };

    currentConfig.fields.forEach((f) => {
      if (f.type === 'number') {
        payload[f.key] = Number(payload[f.key]);
      }
      if (f.type === 'lines') {
        payload[f.key] = String(payload[f.key] || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
      }
    });

    if (selectedRecord) {
      updateMutation.mutate({ id: selectedRecord._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // An unrecognised slug used to render nothing at all, which looked identical to a
  // crash. Show a real empty state instead.
  if (!currentConfig) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-lg rounded-2xl border border-adm-line bg-adm-surface p-8 py-16 text-center shadow-adm-sm animate-fadeIn">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-adm-danger-soft text-adm-danger">
            <FileQuestion className="h-7 w-7" />
          </div>
          <h2 className="mb-2 text-lg font-semibold tracking-tight text-adm-text">Master not found</h2>
          <p className="mx-auto mb-7 max-w-sm text-sm leading-relaxed text-adm-muted">
            There is no master table configured for{' '}
            <span className="font-semibold">&ldquo;{moduleKey}&rdquo;</span>. Check the menu route in Menu
            Master, or pick another screen from the sidebar.
          </p>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-adm-primary px-5 py-2.5 text-sm font-semibold text-adm-primary-fg shadow-adm-sm transition-colors hover:bg-adm-primary-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const finalColumns = [
    {
      id: 'srNo',
      header: 'Sr No',
      cell: ({ row }) => <span>{(pageIndex - 1) * pageSize + row.index + 1}</span>,
      size: 60,
    },
    ...currentConfig.columns,
  ];

  return (
    <AdminLayout>
      <PageHeader
        title={currentConfig.title}
        subtitle={`System dynamic database records panel interface for ${currentConfig.title}.`}
        breadcrumbs={[{ label: 'Master Tables' }, { label: currentConfig.title }]}
        action={
          activePermissions.canCreate &&
          !currentConfig.readOnly &&
          !currentConfig.createDisabled && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm cursor-pointer animate-fadeIn"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Create Record</span>
            </button>
          )
        }
      />

      <DataTable
        columns={finalColumns}
        data={listData?.data || []}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRecords={listData?.meta?.total || 0}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        search={search}
        onSearchChange={setSearch}
        sorting={sorting}
        onSortingChange={setSorting}
        onEdit={activePermissions.canEdit && !currentConfig.readOnly ? handleOpenEdit : undefined}
        onDelete={activePermissions.canDelete && !currentConfig.readOnly ? handleOpenDelete : undefined}
      />

      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={closeForm}
          title={selectedRecord ? `Edit ${currentConfig.title} Record` : `Create ${currentConfig.title}`}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {currentConfig.fields.map((field) => {
              if (field.type === 'boolean') {
                return (
                  <div key={field.key} className="pt-2">
                    <ActiveToggle
                      value={!!formData[field.key]}
                      onChange={(val) => handleFieldChange(field.key, val)}
                      label={field.label}
                    />
                  </div>
                );
              }

              if (field.type === 'image') {
                return (
                  <div key={field.key} className="pt-1">
                    <ImageUploadInput
                      label={`${field.label} ${field.required ? '*' : ''}`}
                      value={formData[field.key] || ''}
                      onChange={(val) => handleFieldChange(field.key, val)}
                      group={field.group || 'products'}
                    />
                  </div>
                );
              }

              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="block text-xs font-bold text-adm-muted uppercase tracking-wide">
                    {field.label} {field.required && '*'}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text cursor-pointer"
                    >
                      <option value="">-- Choose {field.label} --</option>
                      {getFilteredOptions(field).map((opt) => (
                        <option key={opt.id || opt._id} value={opt.id || opt._id}>
                          {opt.name || opt.label || opt.title}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'lines' ? (
                    <textarea
                      rows={5}
                      required={field.required}
                      value={formData[field.key] ?? ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text resize-y"
                      placeholder={'One item per line'}
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      required={field.required}
                      value={formData[field.key] ?? ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text resize-y"
                      placeholder={`Provide ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      value={formData[field.key] ?? ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-adm-surface-2 border border-adm-line rounded-lg focus:outline-none focus:border-adm-primary focus:bg-adm-surface focus:ring-2 focus:ring-adm-primary/25 text-adm-text"
                      placeholder={`Provide ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-adm-line-soft">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 text-sm font-semibold border border-adm-line hover:bg-adm-surface-3 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-5 py-2 text-sm font-semibold bg-adm-primary hover:bg-adm-primary-hover text-adm-primary-fg rounded-lg transition-all shadow-adm-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>{selectedRecord ? 'Save Changes' : 'Create Record'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedRecord(null);
        }}
        onConfirm={() => selectedRecord && deleteMutation.mutate(selectedRecord._id)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this master record from"${currentConfig.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}
