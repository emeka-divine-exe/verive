interface Props {title:string; value:string; description:string}
export function AdminStatCard({title,value,description}:Props){return <div className="gcard rounded-3xl p-6"><p className="text-white/40 text-sm mb-3">{title}</p><h2 className="text-4xl font-bold text-white mb-2">{value}</h2><p className="text-sm text-white/45">{description}</p></div>}
