export const ExamplesGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
      {children}
    </section>
  )
}
