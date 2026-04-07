/** Empty list — sits on the page canvas with no card chrome (Figma). */
export function EmptyState() {
  return (
    <p
      className="text-base text-[#6B5F58]"
      style={{ fontFamily: 'var(--font-dm-sans)', paddingTop: '8px' }}
    >
      Start swiping to see your picks here
    </p>
  );
}
