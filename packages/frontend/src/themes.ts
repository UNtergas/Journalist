'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /* Put your mantine theme override here */
  colors: {
    gruvbox: ['#fbf1c7', '#f2e5bc', '#ebdbb2', '#d5c4a1', '#bdae93', '#a89984', '#928374', '#7c6f64', '#665c54', '#3c3836'],
    red: ['#fb4934', '#f03a2d', '#e82b26', '#e01c1f', '#d81418', '#cc241d', '#a81d17', '#841612', '#62100c', '#450b06'],
    green: ['#b8bb26', '#acaf23', '#9fa320', '#92971c', '#858b19', '#798f17', '#6d8314', '#616711', '#545a0e', '#474d0b'],
    yellow: ['#fabd2f', '#f2b02c', '#eaa229', '#e19426', '#d98623', '#d79921', '#b97d1c', '#9a6817', '#7b5212', '#5c3c0d'],
    blue: ['#83a598', '#7a968f', '#718586', '#68747d', '#5f6374', '#458588', '#385d5c', '#2b4645', '#1e2e2e', '#111717'],
    purple: ['#d3869b', '#c9798f', '#bf6c83', '#b55f77', '#ab526b', '#b16286', '#8f3f71', '#6d2c5b', '#4c1945', '#2a062f'],
    aqua: ['#8ec07c', '#83b675', '#78ac6e', '#6da268', '#629861', '#689d6a', '#507d55', '#3a5d40', '#243d2a', '#0e1d15'],
    orange: ['#fe8019', '#f47817', '#ea7015', '#e06712', '#d65f10', '#d65d0e', '#af4a0b', '#873808', '#5f2506', '#371303'],
    gray: ['#ebdbb2', '#d4c4a5', '#bdad98', '#a6958a', '#907e7d', '#7a676f', '#645062', '#4d394e', '#372241', '#211b34'],
  },
  primaryColor: 'gruvbox',
  shadows: {
    black_md: '1px 1px 3px rgba(0, 0, 0, 0.4)',
    black_xl: '5px 5px 3px rgba(0, 0, 0, 0.6)',
    white_md: '1px 1px 3px rgba(255, 255, 255, 0.4)',
    white_xl: '5px 5px 3px rgba(255, 255, 255, 0.6)',
  },
});