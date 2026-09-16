/**
 * As rotas são dinâmicas (dependem do cookie de idioma) e o conteúdo vem do
 * Contentful, então há uma espera real antes do primeiro byte útil.
 */
export default function WordsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 lg:px-8">
      <div className="mb-8 max-w-xl">
        <div className="h-12 w-48 animate-pulse rounded-lg bg-black/5 dark:bg-white/5" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-black/5 dark:bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
        <div className="reading-surface h-64 animate-pulse lg:order-2" />
        <div className="reading-surface h-96 animate-pulse lg:order-1" />
      </div>
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  );
}
