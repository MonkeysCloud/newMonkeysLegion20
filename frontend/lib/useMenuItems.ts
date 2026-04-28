'use client';

import { useState, useEffect } from 'react';
import type { MenuItem } from '../app/components/layout/Navbar';

/**
 * Client-side hook to fetch menu items directly from the Drupal API.
 * The /api/menu/{name} endpoint is proxied by Nginx to Drupal.
 */
export function useMenuItems(menuName: string = 'main') {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch(`/api/menu/${menuName}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMenuItems(Array.isArray(data) ? data : []))
      .catch(() => setMenuItems([]));
  }, [menuName]);

  return menuItems;
}
