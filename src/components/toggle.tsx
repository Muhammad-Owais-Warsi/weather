'use client'

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {VisuallyHidden, useSwitch} from '@nextui-org/react';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';



const ThemeSwitch = ({props}:any) => {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch(props);

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isSelected) {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    }
  }, [isSelected, setTheme, mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              'w-8 h-8',
              'flex items-center justify-center',
              'rounded-lg bg-default-100 hover:bg-default-200',
            ],
          })}
        >
          {isSelected ? <SunIcon /> : <MoonIcon />}
        </div>
      </Component>
    </div>
  );
};

const Toggle: React.FC = () => {
  return <ThemeSwitch />;
}

export default Toggle;
