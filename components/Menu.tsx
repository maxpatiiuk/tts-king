import Link                 from 'next/link';
import React                from 'react';
import { useRouter }        from 'next/router';
import { MenuItem }         from '../lib/menuComponents';
import { contentClassName } from './UI';


const MenuItems = ({
  menuItems,
  currentPage,
}: {
  menuItems: Record<string, MenuItem>,
  currentPage: string,
}) => <div className='contents sm:flex sm:gap-x-4 items-center'>{
  Object.entries(menuItems).map(([
      linkPath,
      menuItem,
    ], index) =>
      <Link
        href={linkPath}
        key={index}
      >
        <a
          itemProp="url"
          className={
            `hover:text-black w-fit-content sm:w-auto
            ${
              menuItem.classNames ||
              (
                currentPage === linkPath ?
                  'text-gray-300 underline' :
                  'text-gray-600'
              )
            }`
          }
        >{menuItem.label}</a>
      </Link>,
  )
}</div>;

export default function Menu({
  menuItemGroups,
}: {menuItemGroups: Record<string, MenuItem>[]}) {

  const {route} = useRouter();

  return <header
    className='p-4 border-b mb-4'
  >
    <nav
      className={`${contentClassName} flex flex-wrap justify-between
        max-w-screen-lg flex-col sm:flex-row gap-4 sm:gap-0`}
      itemScope
      itemType="http://schema.org/SiteNavigationElement"
    >{
      menuItemGroups.map((
        menuItems,
        index,
        ) =>
          <MenuItems
            key={index}
            currentPage={route}
            menuItems={menuItems}
          />,
      )
    }</nav>
  </header>;
}