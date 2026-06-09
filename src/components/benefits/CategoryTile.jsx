import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryTile({ category }) {
  return (
    <Link
      to={`/benefits/${category.id}`}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${category.tileGradient}`} />
      <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/5" />
      <span className="absolute left-3 top-3 text-2xl drop-shadow-md">{category.emoji}</span>
      <span className="absolute bottom-3 left-3 right-3 text-sm font-inter font-bold uppercase tracking-wide text-white drop-shadow-md">
        {category.label}
      </span>
      <span className="absolute bottom-3 right-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-sm">
        {category.benefits.length}
      </span>
    </Link>
  );
}
