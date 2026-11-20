import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Plus, ArrowUp, ArrowDown, Trash2, Save, Check } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioNavigationPage: React.FC = () => {
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [activeLocation, setActiveLocation] = useState<'main' | 'footer' | 'product'>('main');
  const [isLoading, setIsLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.navigation.get();
      setMenus(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const currentMenu = menus.find((m) => m.id === activeLocation) || {
    id: activeLocation,
    name: `${activeLocation.toUpperCase()} Navigation`,
    items: [],
    updatedAt: '',
  };

  const handleAddItem = () => {
    const newItem: NavigationMenuItem = {
      id: `item-${Date.now()}`,
      label: 'New Link',
      path: '#',
      order: currentMenu.items.length + 1,
      isEnabled: true,
    };
    const updated = {
      ...currentMenu,
      items: [...currentMenu.items, newItem],
    };
    setMenus(menus.map((m) => (m.id === activeLocation ? updated : m)));
  };

  const handleUpdateItem = (id: string, updates: Partial<NavigationMenuItem>) => {
    const updated = {
      ...currentMenu,
      items: currentMenu.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    };
    setMenus(menus.map((m) => (m.id === activeLocation ? updated : m)));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= currentMenu.items.length) return;

    const items = [...currentMenu.items];
    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;

    items.forEach((it, idx) => {
      it.order = idx + 1;
    });

    const updated = { ...currentMenu, items };
    setMenus(menus.map((m) => (m.id === activeLocation ? updated : m)));
  };

  const handleDelete = (id: string) => {
    const updated = {
      ...currentMenu,
      items: currentMenu.items.filter((i) => i.id !== id),
    };
    setMenus(menus.map((m) => (m.id === activeLocation ? updated : m)));
  };

  const handleSave = async () => {
    // Validate destinations: prevent exposing /studio or #studio
    for (const item of currentMenu.items) {
      if (item.path.toLowerCase().includes('studio')) {
        alert('Security rule: Navigation menus must never expose private Studio routes to the public.');
        return;
      }
    }
    try {
      await api.studio.navigation.update(activeLocation, currentMenu.items);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Navigation Structure Editor
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure main header tabs, footer sitemaps, and product sub-menus with destination validation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved' : 'Save Menu'}</span>
          </button>
        </div>
      </div>

      {/* Location Selector Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        {(['main', 'footer', 'product'] as const).map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocation(loc)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
              activeLocation === loc
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {loc} Navigation
          </button>
        ))}
      </div>

      {/* Menu Items Table */}
      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <div className="p-4 space-y-2">
          {currentMenu.items.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">No menu items configured for this location.</p>
          ) : (
            currentMenu.items.map((item, index) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/30 flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center space-x-2 text-neutral-400">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-[10px] font-bold">{index + 1}</span>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === currentMenu.items.length - 1}
                    className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                    placeholder="Link Label"
                    className="p-1.5 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 outline-none"
                  />
                  <input
                    type="text"
                    value={item.path}
                    onChange={(e) => handleUpdateItem(item.id, { path: e.target.value })}
                    placeholder="#destination or https://..."
                    className="p-1.5 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 outline-none"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isEnabled}
                      onChange={(e) => handleUpdateItem(item.id, { isEnabled: e.target.checked })}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                    />
                    <span className="text-[11px] text-neutral-500">Enabled</span>
                  </label>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
