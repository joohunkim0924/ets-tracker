import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryTile({ category }) {
  return (
    <Link
      to={`/benefits/${category.id}`}
      className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl border-2 bg-black transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] ${category.tileBorder}`}
    >
      <span className="absolute left-3 top-3 text-2xl">{category.emoji}</span>
      <span className="absolute bottom-3 left-3 right-12 text-sm font-inter font-bold uppercase tracking-wide text-white">
        {category.label}
      </span>
      <span className={`absolute bottom-3 right-3 rounded-full border px-2 py-0.5 text-[10px] font-mono text-white ${category.tileBorder}`}>
        {category.benefits.length}
      </span>
    </Link>
  );
}
