import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Leaf, LayoutDashboard, PenTool, Sparkles, Trophy } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Log Activity', path: '/log', icon: PenTool },
    { name: 'Insights', path: '/insights', icon: Sparkles },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 tracking-tight transition-opacity hover:opacity-90">
              <span className="p-1.5 bg-[#1D9E75]/10 rounded-lg text-[#1D9E75]">
                <Leaf size={22} className="fill-[#1D9E75]/20" />
              </span>
              <span className="bg-gradient-to-r from-[#1D9E75] to-[#639922] bg-clip-text text-transparent">CarbonSense</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-[#1D9E75] bg-[#1D9E75]/5'
                        : 'text-gray-600 hover:text-[#1D9E75] hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-[#1D9E75] hover:bg-gray-50 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-150 ${
                    isActive
                      ? 'text-[#1D9E75] bg-[#1D9E75]/5'
                      : 'text-gray-600 hover:text-[#1D9E75] hover:bg-gray-50'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}
