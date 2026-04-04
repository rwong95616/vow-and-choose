/** Empty list — sits on the page canvas with no card chrome (Figma). */
export function EmptyState() {
  return (
    <p
      className="font-[family-name:var(--font-playfair)] italic text-[20px] leading-normal text-[#B8B0A8]"
      style={{ paddingTop: '8px' }}
    >
      Start swiping to see your picks here
    </p>
  );
}
