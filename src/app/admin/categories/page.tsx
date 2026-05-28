const categories = [
  { name: 'Tech', slug: 'tech', visibility: 'Visible' },
  { name: 'Design', slug: 'design', visibility: 'Visible' },
  { name: 'Startup', slug: 'startup', visibility: 'Visible' },
]

export default function CategoriesPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300 mb-4">Categories</p>
        <h1 className="text-4xl font-semibold text-white mb-3">Category Management</h1>
        <p className="text-white/50 max-w-2xl">Manage visibility, metadata, and event organization structure.</p>
      </div>

      <div className="gcard rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr className="text-left text-white/50 text-sm">
              <th className="p-5">Name</th>
              <th className="p-5">Slug</th>
              <th className="p-5">Visibility</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.slug} className="border-b border-white/5 text-white/80">
                <td className="p-5">{category.name}</td>
                <td className="p-5">{category.slug}</td>
                <td className="p-5">{category.visibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
