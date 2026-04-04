export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200">
          <img
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALXLExX8mPTj8Vn64fNOLQWiLD5OZzYwl6WdsWCapEiAjxgHyWeVHVe5GdqugmzY-iENNEM0tp4-4gPyg9tw-__0NzC-q10dKIVLAMFP0Q2lJGYs5WIDRNwGorTa8oCldHZeM8sjQREAnALhpktLAU_CEd5Oe9b0GMwX1vq_dVxP4DHyXI5U-J9UQUeiGgCK5nmaNRXCF0ojNq40ivY3Eoo6nHEghfXt-WMSSgc3fz8q_fhnaV83nxplVvC0oukDNBbxS0AMgMtvU"
            alt="Family avatar"
          />
        </div>
        <h1 className="text-lg font-bold tracking-tight">משפחת כהן</h1>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
      >
        🔔
      </button>
    </header>
  )
}