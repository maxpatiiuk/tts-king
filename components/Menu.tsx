import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import type { MenuItem } from '../lib/menuComponents';
import { unpaddedContentClassName } from './UI';

const MenuItems = ({
  menuItems,
  currentPage,
}: {
  readonly menuItems: Readonly<Record<string, MenuItem>>;
  readonly currentPage: string;
}): JSX.Element => (
  <div className="contents sm:flex sm:gap-x-4 items-center">
    {Object.entries(menuItems).map(
      ([linkPath, menuItem]: Readonly<[string, MenuItem]>, index) => (
        <Link href={linkPath} key={index}>
          <a
            itemProp="url"
            className={`hover:text-black w-fit-content sm:w-auto
            ${
              menuItem.classNames ??
              (currentPage === linkPath
                ? 'text-gray-300 underline'
                : 'text-gray-600')
            }`}
          >
            {menuItem.label}
          </a>
        </Link>
      )
    )}
  </div>
);

export default function Menu({
  menuItemGroups,
}: {
  readonly menuItemGroups: Readonly<Readonly<Record<string, MenuItem>>[]>;
}): JSX.Element {
  const { route } = useRouter();

  return (
    <header className="p-4 border-b mb-4">
      <nav
        className={`${unpaddedContentClassName} flex flex-wrap justify-between
        max-w-screen-lg flex-col sm:flex-row gap-4 sm:gap-0`}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        {menuItemGroups.map((menuItems, index) => (
          <MenuItems key={index} currentPage={route} menuItems={menuItems} />
        ))}
      </nav>
    </header>
  );
}
