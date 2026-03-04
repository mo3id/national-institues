/**
 * ============================================================
 *  VITEST + REACT TESTING LIBRARY
 *  Target: Schools.tsx — Smart School Directory
 *  Covers:
 *   1. Data rendering from React Query (via DataContext mock)
 *   2. Filtering logic by governorate & type & search
 *   3. Zustand store: theme + RTL/LTR language state changes
 * ============================================================
 *
 *  Setup (run once):
 *    npm install -D vitest @vitest/coverage-v8 jsdom \
 *      @testing-library/react @testing-library/user-event \
 *      @testing-library/jest-dom
 *
 *  Add to vite.config.ts:
 *    test: { environment: 'jsdom', globals: true,
 *            setupFiles: './tests/unit/setup.ts' }
 *
 *  Run:
 *    npx vitest run tests/unit/SchoolDirectory.test.tsx --reporter=verbose
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────────────────

/** Shared mock school data (mirrors the real School interface) */
const MOCK_SCHOOLS = [
    {
        id: 'school-1',
        name: 'Cairo National Institute',
        nameAr: 'معهد القاهرة القومي',
        location: 'Nasr City',
        locationAr: 'مدينة نصر',
        governorate: 'Cairo',
        governorateAr: 'القاهرة',
        principal: 'Dr. Ahmed Hassan',
        principalAr: 'د. أحمد حسن',
        logo: '/logo1.png',
        type: 'Arabic' as const,
        mainImage: '/img1.png',
        rating: '4.8',
        studentCount: '1200',
        foundedYear: '1995',
    },
    {
        id: 'school-2',
        name: 'Alexandria Languages Institute',
        nameAr: 'معهد الإسكندرية للغات',
        location: 'Smouha',
        locationAr: 'السموحة',
        governorate: 'Alexandria',
        governorateAr: 'الإسكندرية',
        principal: 'Ms. Nora Khalil',
        principalAr: 'أ. نورا خليل',
        logo: '/logo2.png',
        type: 'Languages' as const,
        mainImage: '/img2.png',
        rating: '4.9',
        studentCount: '850',
        foundedYear: '2001',
    },
    {
        id: 'school-3',
        name: 'Giza American Academy',
        nameAr: 'الأكاديمية الأمريكية بالجيزة',
        location: 'Dokki',
        locationAr: 'الدقي',
        governorate: 'Giza',
        governorateAr: 'الجيزة',
        principal: 'Mr. John Smith',
        logo: '/logo3.png',
        type: 'American' as const,
        mainImage: '/img3.png',
        rating: '5.0',
        foundedYear: '2010',
    },
];

/** Mock LanguageContext – English (LTR) default */
const mockLanguageContextEN = {
    lang: 'en',
    isRTL: false,
    t: {
        schools: {
            title: 'Our Schools',
            subtitle: 'Find the right school',
            searchPlaceholder: 'Search schools...',
            filterGov: 'All Governorates',
            filterType: 'All Types',
            clearFilters: 'Clear Filters',
            noResults: 'No schools found',
            principal: 'Principal',
            viewProfile: 'View Profile',
            types: {
                Arabic: 'Arabic',
                Languages: 'Languages',
                American: 'American',
                British: 'British',
                French: 'French',
            },
        },
        common: {
            facilities: 'Facilities',
            rating: 'Rating',
            students: 'Students',
            founded: 'Founded',
        },
    },
};

/** Mock LanguageContext – Arabic (RTL) */
const mockLanguageContextAR = {
    ...mockLanguageContextEN,
    lang: 'ar',
    isRTL: true,
    t: {
        ...mockLanguageContextEN.t,
        schools: {
            ...mockLanguageContextEN.t.schools,
            title: 'مدارسنا',
            subtitle: 'ابحث عن المدرسة المناسبة',
            searchPlaceholder: 'ابحث عن مدرسة...',
            filterGov: 'كل المحافظات',
            filterType: 'كل الأنواع',
            clearFilters: 'مسح الفلاتر',
            noResults: 'لا توجد مدارس',
            principal: 'المدير',
            viewProfile: 'عرض الملف',
        },
    },
};

/** DataContext mock */
const mockSiteData = { data: { schools: MOCK_SCHOOLS, jobs: [], news: [] } };

// ── Module Mocks via vi.mock ──────────────────────────────────────────────────

vi.mock('@/context/LanguageContext', () => ({
    useLanguage: vi.fn(() => mockLanguageContextEN),
}));

vi.mock('@/context/DataContext', () => ({
    useSiteData: vi.fn(() => mockSiteData),
}));

vi.mock('@/constants', () => ({
    SCHOOLS: [],
    GOVERNORATES: [
        { name: 'Cairo', nameAr: 'القاهرة' },
        { name: 'Alexandria', nameAr: 'الإسكندرية' },
        { name: 'Giza', nameAr: 'الجيزة' },
    ],
}));

vi.mock('@/components/common/NISLogo', () => ({
    default: () => <div data-testid="nis-logo" />,
}));

vi.mock('@/components/common/PageTransition', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/common/ScrollReveal', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/common/FormControls', () => ({
    CustomSelect: ({ value, onChange, options, placeholder }: any) => (
        <select
            data-testid="custom-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((o: any) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    ),
}));

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import Schools from '@/pages/Schools';
import { useStore } from '@/store/useStore';

// ── Helper ────────────────────────────────────────────────────────────────────

const renderSchools = () =>
    render(
        <MemoryRouter>
            <Schools />
        </MemoryRouter>
    );

// ═════════════════════════════════════════════════════════════════════════════
// 1.  DATA RENDERING FROM REACT QUERY / DATA CONTEXT
// ═════════════════════════════════════════════════════════════════════════════

describe('1. Data Rendering – Schools Page', () => {
    beforeEach(() => {
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextEN as any);
        vi.mocked(useSiteData).mockReturnValue(mockSiteData as any);
    });

    it('1.1 renders all 3 mock schools from DataContext', () => {
        renderSchools();
        expect(screen.getByText('Cairo National Institute')).toBeInTheDocument();
        expect(screen.getByText('Alexandria Languages Institute')).toBeInTheDocument();
        expect(screen.getByText('Giza American Academy')).toBeInTheDocument();
    });

    it('1.2 shows the correct school count in the counter badge', () => {
        renderSchools();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText(/schools available/i)).toBeInTheDocument();
    });

    it('1.3 renders school type badge for each card', () => {
        renderSchools();
        // 'Arabic' appears in the type badge AND in the type dropdown option
        const arabicEls = screen.getAllByText('Arabic');
        expect(arabicEls.length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Languages').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('American').length).toBeGreaterThanOrEqual(1);
    });

    it('1.4 renders "View Profile" button for each school', () => {
        renderSchools();
        const viewButtons = screen.getAllByText('View Profile');
        expect(viewButtons).toHaveLength(3);
    });

    it('1.5 handles empty schools array gracefully – shows no-results state', () => {
        vi.mocked(useSiteData).mockReturnValue({
            data: { schools: [], jobs: [], news: [] },
        } as any);
        renderSchools();
        expect(screen.getByText('No schools found')).toBeInTheDocument();
    });

    it('1.6 renders school principal name truncated to first word', () => {
        renderSchools();
        // Principal: "Dr. Ahmed Hassan" → first word = "Dr."
        expect(screen.getByText(/Principal: Dr\./)).toBeInTheDocument();
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2.  FILTERING LOGIC BY GOVERNORATE
// ═════════════════════════════════════════════════════════════════════════════

describe('2. Filtering Logic', () => {
    beforeEach(() => {
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextEN as any);
        vi.mocked(useSiteData).mockReturnValue(mockSiteData as any);
    });

    it('2.1 filters schools by search query (name match)', async () => {
        renderSchools();
        const searchInput = screen.getByPlaceholderText('Search schools...');
        await userEvent.type(searchInput, 'Cairo');
        expect(screen.getByText('Cairo National Institute')).toBeInTheDocument();
        expect(screen.queryByText('Alexandria Languages Institute')).not.toBeInTheDocument();
        expect(screen.queryByText('Giza American Academy')).not.toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('2.2 filters schools by location keyword in search', async () => {
        renderSchools();
        const searchInput = screen.getByPlaceholderText('Search schools...');
        await userEvent.type(searchInput, 'Smouha');
        expect(screen.getByText('Alexandria Languages Institute')).toBeInTheDocument();
        expect(screen.queryByText('Cairo National Institute')).not.toBeInTheDocument();
    });

    it('2.3 filters by governorate using the dropdown', async () => {
        renderSchools();
        const selects = screen.getAllByTestId('custom-select');
        const governorateSelect = selects[0];
        fireEvent.change(governorateSelect, { target: { value: 'Giza' } });
        expect(screen.getByText('Giza American Academy')).toBeInTheDocument();
        expect(screen.queryByText('Cairo National Institute')).not.toBeInTheDocument();
        expect(screen.queryByText('Alexandria Languages Institute')).not.toBeInTheDocument();
    });

    it('2.4 filters by school type using the type dropdown', async () => {
        renderSchools();
        const selects = screen.getAllByTestId('custom-select');
        const typeSelect = selects[1];
        fireEvent.change(typeSelect, { target: { value: 'Languages' } });
        expect(screen.getByText('Alexandria Languages Institute')).toBeInTheDocument();
        expect(screen.queryByText('Cairo National Institute')).not.toBeInTheDocument();
    });

    it('2.5 combines search + governorate filter (AND logic)', async () => {
        renderSchools();
        const searchInput = screen.getByPlaceholderText('Search schools...');
        await userEvent.type(searchInput, 'Institute');
        const selects = screen.getAllByTestId('custom-select');
        fireEvent.change(selects[0], { target: { value: 'Cairo' } });
        // "Cairo National Institute" matches both
        expect(screen.getByText('Cairo National Institute')).toBeInTheDocument();
        // "Alexandria Languages Institute" matches search but NOT governorate=Cairo
        expect(screen.queryByText('Alexandria Languages Institute')).not.toBeInTheDocument();
    });

    it('2.6 clears all filters via the "Clear Filters" button', async () => {
        renderSchools();
        const searchInput = screen.getByPlaceholderText('Search schools...');
        await userEvent.type(searchInput, 'Cairo');
        const clearBtn = await screen.findByText('Clear Filters');
        await userEvent.click(clearBtn);
        await waitFor(() => {
            expect(screen.getByText('Alexandria Languages Institute')).toBeInTheDocument();
            expect(screen.getByText('Giza American Academy')).toBeInTheDocument();
        });
    });

    it('2.7 search is case-insensitive', async () => {
        renderSchools();
        const searchInput = screen.getByPlaceholderText('Search schools...');
        await userEvent.type(searchInput, 'CAIRO');
        expect(screen.getByText('Cairo National Institute')).toBeInTheDocument();
    });

    it('2.8 shows "No schools found" when no filter matches', async () => {
        renderSchools();
        const searchInput = screen.getByPlaceholderText('Search schools...');
        await userEvent.type(searchInput, 'XYZNONEXISTENT');
        expect(screen.getByText('No schools found')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3.  ZUSTAND STATE — LANGUAGE SWITCH (RTL ↔ LTR)
// ═════════════════════════════════════════════════════════════════════════════

describe('3. Zustand Store – Language & Theme State', () => {
    it('3.1 Zustand useStore initialises with theme: light', () => {
        const state = useStore.getState();
        expect(state.theme).toBe('light');
    });

    it('3.2 Zustand toggleTheme switches light → dark', () => {
        const { toggleTheme } = useStore.getState();
        toggleTheme();
        expect(useStore.getState().theme).toBe('dark');
        // reset
        toggleTheme();
        expect(useStore.getState().theme).toBe('light');
    });

    it('3.3 renders Arabic school names when lang=ar RTL mode', () => {
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextAR as any);
        vi.mocked(useSiteData).mockReturnValue(mockSiteData as any);
        renderSchools();
        expect(screen.getByText('معهد القاهرة القومي')).toBeInTheDocument();
        expect(screen.getByText('معهد الإسكندرية للغات')).toBeInTheDocument();
    });

    it('3.4 renders Arabic governorate + location in RTL mode', () => {
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextAR as any);
        vi.mocked(useSiteData).mockReturnValue(mockSiteData as any);
        renderSchools();
        // Arabic text appears in: school cards AND in the governorate dropdown <option>s
        const govEls = screen.queryAllByText(/القاهرة/);
        expect(govEls.length).toBeGreaterThanOrEqual(1);
        const locEls = screen.queryAllByText(/مدينة نصر/);
        expect(locEls.length).toBeGreaterThanOrEqual(1);
    });

    it('3.5 renders page title in Arabic when lang=ar', () => {
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextAR as any);
        vi.mocked(useSiteData).mockReturnValue(mockSiteData as any);
        renderSchools();
        expect(screen.getByText('مدارسنا')).toBeInTheDocument();
    });

    it('3.6 card container has dir="rtl" attribute when isRTL=true', () => {
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextAR as any);
        vi.mocked(useSiteData).mockReturnValue(mockSiteData as any);
        renderSchools();
        // The inner div that wraps content gets dir="rtl" from the Schools component
        const rtlContainer = document.querySelector('[dir="rtl"]');
        expect(rtlContainer).toBeTruthy();
    });

    it('3.7 switching from AR→EN shows English school names', () => {
        // First render Arabic
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextAR as any);
        vi.mocked(useSiteData).mockReturnValue(mockSiteData as any);
        const { unmount } = renderSchools();
        expect(screen.getByText('معهد القاهرة القومي')).toBeInTheDocument();
        unmount();

        // Then render English
        vi.mocked(useLanguage).mockReturnValue(mockLanguageContextEN as any);
        renderSchools();
        expect(screen.getByText('Cairo National Institute')).toBeInTheDocument();
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4.  ZOD VALIDATION SCHEMAS (unit)
// ═════════════════════════════════════════════════════════════════════════════

describe('4. Zod Validation Schemas', () => {
    let getJobApplicationSchema: typeof import('@/utils/validations').getJobApplicationSchema;
    let getContactSchema: typeof import('@/utils/validations').getContactSchema;
    let getComplaintSchema: typeof import('@/utils/validations').getComplaintSchema;

    beforeAll(async () => {
        const validations = await import('@/utils/validations');
        getJobApplicationSchema = validations.getJobApplicationSchema;
        getContactSchema = validations.getContactSchema;
        getComplaintSchema = validations.getComplaintSchema;
    });

    // — Job Application Schema ————————————————————————————————————————————
    describe('4.1 getJobApplicationSchema (EN)', () => {
        it('passes with valid data', () => {
            const schema = getJobApplicationSchema('en');
            const result = schema.safeParse({
                fullName: 'John Smith',
                email: 'john@example.com',
                phone: '+201234567890',
                job: 'job-1',
                file: new File(['cv'], 'cv.pdf'),
            });
            expect(result.success).toBe(true);
        });

        it('fails when fullName is too short', () => {
            const schema = getJobApplicationSchema('en');
            const result = schema.safeParse({
                fullName: 'Jo',
                email: 'john@example.com',
                phone: '+201234567890',
                file: new File(['cv'], 'cv.pdf'),
            });
            expect(result.success).toBe(false);
            const msgs = result.error?.issues.map((i) => i.message);
            expect(msgs).toContain('Full name must be at least 3 characters');
        });

        it('fails with invalid email format', () => {
            const schema = getJobApplicationSchema('en');
            const result = schema.safeParse({
                fullName: 'John Smith',
                email: 'not-an-email',
                phone: '+201234567890',
                file: new File(['cv'], 'cv.pdf'),
            });
            expect(result.success).toBe(false);
        });

        it('fails when file is null', () => {
            const schema = getJobApplicationSchema('en');
            const result = schema.safeParse({
                fullName: 'John Smith',
                email: 'john@example.com',
                phone: '+201234567890',
                file: null,
            });
            expect(result.success).toBe(false);
            const msgs = result.error?.issues.map((i) => i.message);
            expect(msgs).toContain('Please upload your CV');
        });

        it('returns Arabic error messages when lang=ar', () => {
            const arSchema = getJobApplicationSchema('ar');
            const result = arSchema.safeParse({
                fullName: 'أ',
                email: 'bad',
                phone: '',
                file: null,
            });
            expect(result.success).toBe(false);
            const msgs = result.error?.issues.map((i) => i.message);
            expect(msgs?.some((m) => /يجب/.test(m))).toBe(true);
        });
    });

    // — Contact Schema ————————————————————————————————————————————————————
    describe('4.2 getContactSchema (EN)', () => {
        it('fails when message is under 10 chars', () => {
            const schema = getContactSchema('en');
            const result = schema.safeParse({
                fullName: 'Test User',
                email: 'test@example.com',
                subject: 'Hello',
                message: 'Short',
            });
            expect(result.success).toBe(false);
        });

        it('passes with complete valid data', () => {
            const schema = getContactSchema('en');
            const result = schema.safeParse({
                fullName: 'Test User',
                email: 'test@example.com',
                subject: 'Inquiry',
                message: 'This is a valid message with enough characters.',
            });
            expect(result.success).toBe(true);
        });
    });
});
