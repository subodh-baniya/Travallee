export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg font-sans text-brand-accent2">
      <div className="flex items-center gap-[14px]">
        <div className="w-[42px] h-[42px] rounded-full border-4 border-brand-accent/16 border-t-brand-accent animate-spin box-border" />
        <span className="text-brand-accent text-sm font-medium">Loading superadmin workspace...</span>
      </div>
    </div>
  );
}
