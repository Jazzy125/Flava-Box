import type { ReactNode } from 'react';
import { Breadcrumbs, FoodImage, Kicker } from './Brand';
export default function PageIntro({ page, label, title, description, image, children }: { page: string; label: string; title: string; description: string; image?: string; children?: ReactNode }) {
  return <section className={'page-intro '+(!image ? 'no-intro-photo' : '')}>{image && <div className="intro-photo"><FoodImage src={'/images/'+image+'.webp'} alt={page+' food inspiration'} sizes="50vw" priority/></div>}<div className="intro-shade"/><div className="wrap"><Breadcrumbs page={page}/><div className="intro-copy"><Kicker>{label}</Kicker><h1 className="ink-text">{title}</h1><p>{description}</p>{children}</div></div></section>;
}
