export default function SuccessStep({ name, roles, onClose }) {
  const roleLabel =
    roles.includes('farmer') && roles.includes('buyer')
      ? 'a farmer and buyer'
      : roles.includes('farmer')
      ? 'a farmer'
      : 'a buyer'

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-2xl">
        ✓
      </div>
      <h2 className="font-display text-2xl font-semibold text-ink">You&rsquo;re in, {name.split(' ')[0]}!</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Your account is set up as {roleLabel}. You can add the other role
        anytime from your profile.
      </p>
      <button
        onClick={onClose}
        className="mt-6 w-full rounded-full bg-forest py-3 text-[13.5px] font-semibold text-parchment transition hover:bg-forest-dark"
      >
        Go to GrowNet →
      </button>
    </div>
  )
}
