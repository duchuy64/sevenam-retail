(() => {
  'use strict';

  const STORAGE_KEY = 'sevenam-retail-kpi-dashboard-v16';
  const BASE = { w:1536, h:1024 };
  const EXPORT_2K = { w:2046, h:1364, tag:'2K' }; // exact 3:2
  const EXPORT_4K = { w:4092, h:2728, tag:'4K' }; // exact 2x of 2K, preserves 3:2
  const FONT_STACK = 'Arial, sans-serif';
  const C = {
    bg:'#07131e', bg2:'#091b2a', white:'#ffffff', ink:'#14191f', text:'#22272d', muted:'#69737d',
    navy:'#0b3f79', navy2:'#0d4b8e', line:'#d5d9dd', track:'#e7e9eb',
    purple:'#8b3bd7', purple2:'#6f2ac5', green:'#55b52c', greenDark:'#2f8f1f',
    orange:'#f5a000', red:'#ee3737', blue:'#188bd8', cyan:'#0799e8'
  };


  const ICON_ASSETS = {
    completion_red:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjI3IiBmaWxsPSIjZWUzNzM3Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0yMiAzMiBMMjkgMzkgTDQzIDIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNiNzIwMjAiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==',
    average_red:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxyZWN0IHg9IjkiIHk9IjM2IiB3aWR0aD0iOSIgaGVpZ2h0PSIxOSIgcng9IjIiIGZpbGw9IiNlZTM3MzciLz4KPHJlY3QgeD0iMjMiIHk9IjI5IiB3aWR0aD0iOSIgaGVpZ2h0PSIyNiIgcng9IjIiIGZpbGw9IiNlZTM3MzciLz4KPHJlY3QgeD0iMzciIHk9IjIwIiB3aWR0aD0iOSIgaGVpZ2h0PSIzNSIgcng9IjIiIGZpbGw9IiNiNzIwMjAiLz4KPHBhdGggZD0iTTEwIDMwIEwyMiAxOSBMMzEgMjUgTDUxIDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2I3MjAyMCIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTQ0IDggSDU1IFYxOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYjcyMDIwIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    completion_orange:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjI3IiBmaWxsPSIjZjVhMDAwIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0yMiAzMiBMMjkgMzkgTDQzIDIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNjNDdiMDAiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==',
    average_orange:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxyZWN0IHg9IjkiIHk9IjM2IiB3aWR0aD0iOSIgaGVpZ2h0PSIxOSIgcng9IjIiIGZpbGw9IiNmNWEwMDAiLz4KPHJlY3QgeD0iMjMiIHk9IjI5IiB3aWR0aD0iOSIgaGVpZ2h0PSIyNiIgcng9IjIiIGZpbGw9IiNmNWEwMDAiLz4KPHJlY3QgeD0iMzciIHk9IjIwIiB3aWR0aD0iOSIgaGVpZ2h0PSIzNSIgcng9IjIiIGZpbGw9IiNjNDdiMDAiLz4KPHBhdGggZD0iTTEwIDMwIEwyMiAxOSBMMzEgMjUgTDUxIDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2M0N2IwMCIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTQ0IDggSDU1IFYxOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzQ3YjAwIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    completion_blue:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjI3IiBmaWxsPSIjMTg4YmQ4Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0yMiAzMiBMMjkgMzkgTDQzIDIzIiBmaWxsPSJub25lIiBzdHJva2U9IiMwZDY5YWEiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==',
    average_blue:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxyZWN0IHg9IjkiIHk9IjM2IiB3aWR0aD0iOSIgaGVpZ2h0PSIxOSIgcng9IjIiIGZpbGw9IiMxODhiZDgiLz4KPHJlY3QgeD0iMjMiIHk9IjI5IiB3aWR0aD0iOSIgaGVpZ2h0PSIyNiIgcng9IjIiIGZpbGw9IiMxODhiZDgiLz4KPHJlY3QgeD0iMzciIHk9IjIwIiB3aWR0aD0iOSIgaGVpZ2h0PSIzNSIgcng9IjIiIGZpbGw9IiMwZDY5YWEiLz4KPHBhdGggZD0iTTEwIDMwIEwyMiAxOSBMMzEgMjUgTDUxIDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBkNjlhYSIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTQ0IDggSDU1IFYxOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGQ2OWFhIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    completion_green:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjgiIGZpbGw9IiNGMUZBRUQiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMyIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjNTVCNTJDIiBzdHJva2Utd2lkdGg9IjciLz4KICA8cGF0aCBkPSJNMjAuNSAzMi41TDI4LjUgNDAuNUw0NC41IDIzLjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJGOEYxRiIgc3Ryb2tlLXdpZHRoPSI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+',
    average_green:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CjxyZWN0IHg9IjkiIHk9IjM2IiB3aWR0aD0iOSIgaGVpZ2h0PSIxOSIgcng9IjIiIGZpbGw9IiM1NWI1MmMiLz4KPHJlY3QgeD0iMjMiIHk9IjI5IiB3aWR0aD0iOSIgaGVpZ2h0PSIyNiIgcng9IjIiIGZpbGw9IiM1NWI1MmMiLz4KPHJlY3QgeD0iMzciIHk9IjIwIiB3aWR0aD0iOSIgaGVpZ2h0PSIzNSIgcng9IjIiIGZpbGw9IiMyZjhmMWYiLz4KPHBhdGggZD0iTTEwIDMwIEwyMiAxOSBMMzEgMjUgTDUxIDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJmOGYxZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTQ0IDggSDU1IFYxOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMmY4ZjFmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    average_day:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHJlY3QgeD0iOCIgeT0iMTAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0NCIgcng9IjgiIGZpbGw9IiM1NUI1MkMiLz4KICA8cmVjdCB4PSI4IiB5PSIxMCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjEzIiByeD0iOCIgZmlsbD0iIzJGOEYxRiIvPgogIDxyZWN0IHg9IjE3IiB5PSI1IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNCIgcng9IjIuNSIgZmlsbD0iIzJGOEYxRiIvPgogIDxyZWN0IHg9IjQyIiB5PSI1IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNCIgcng9IjIuNSIgZmlsbD0iIzJGOEYxRiIvPgogIDxyZWN0IHg9IjE3IiB5PSIzOCIgd2lkdGg9IjciIGhlaWdodD0iMTAiIHJ4PSIyIiBmaWxsPSIjRkZGRkZGIi8+CiAgPHJlY3QgeD0iMjkiIHk9IjMyIiB3aWR0aD0iNyIgaGVpZ2h0PSIxNiIgcng9IjIiIGZpbGw9IiNGRkZGRkYiLz4KICA8cmVjdCB4PSI0MSIgeT0iMjciIHdpZHRoPSI3IiBoZWlnaHQ9IjIxIiByeD0iMiIgZmlsbD0iI0ZGRkZGRiIvPgogIDxwYXRoIGQ9Ik0xNyAzMSBMMjkgMjUgTDM2IDI4IEw0OCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRThGRkQ5IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    calendar:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHJlY3QgeD0iNyIgeT0iMTEiIHdpZHRoPSI1MCIgaGVpZ2h0PSI0NiIgcng9IjgiIGZpbGw9IiMwRDcxQzUiLz4KICA8cmVjdCB4PSI3IiB5PSIxMSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjE0IiByeD0iOCIgZmlsbD0iIzA3NTc5QiIvPgogIDxyZWN0IHg9IjE2IiB5PSI1IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNSIgcng9IjIuNSIgZmlsbD0iIzBENzFDNSIvPgogIDxyZWN0IHg9IjQzIiB5PSI1IiB3aWR0aD0iNSIgaGVpZ2h0PSIxNSIgcng9IjIuNSIgZmlsbD0iIzBENzFDNSIvPgogIDxnIGZpbGw9IiNGRkZGRkYiPjxyZWN0IHg9IjE1IiB5PSIzMSIgd2lkdGg9IjciIGhlaWdodD0iNyIgcng9IjEiLz48cmVjdCB4PSIyOCIgeT0iMzEiIHdpZHRoPSI3IiBoZWlnaHQ9IjciIHJ4PSIxIi8+PHJlY3QgeD0iNDEiIHk9IjMxIiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIvPjxyZWN0IHg9IjE1IiB5PSI0MyIgd2lkdGg9IjciIGhlaWdodD0iNyIgcng9IjEiLz48cmVjdCB4PSIyOCIgeT0iNDMiIHdpZHRoPSI3IiBoZWlnaHQ9IjciIHJ4PSIxIi8+PHJlY3QgeD0iNDEiIHk9IjQzIiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiByeD0iMSIvPjwvZz4KPC9zdmc+Cg==',
    clock:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjgiIGZpbGw9IiNFOUY1RkQiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMyIgZmlsbD0iIzE4OEJEOCIvPgogIDxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE3IiBmaWxsPSIjRkZGRkZGIi8+CiAgPGcgc3Ryb2tlPSIjMTg4QkQ4IiBzdHJva2Utd2lkdGg9IjMuMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj4KICAgIDxwYXRoIGQ9Ik0zMiAxOHYzIi8+PHBhdGggZD0iTTMyIDQzdjMiLz48cGF0aCBkPSJNMTggMzJoMyIvPjxwYXRoIGQ9Ik00MyAzMmgzIi8+CiAgPC9nPgogIDxwYXRoIGQ9Ik0zMiAzMlYyMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMEQ2OUFBIiBzdHJva2Utd2lkdGg9IjQuOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTMyIDMybDkgNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMEQ2OUFBIiBzdHJva2Utd2lkdGg9IjQuOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMy44IiBmaWxsPSIjMEQ2OUFBIi8+Cjwvc3ZnPg==',
    completion:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjciIGZpbGw9IiM1NUI1MkMiLz4KICA8cGF0aCBkPSJNMzIgNSBBMjcgMjcgMCAwIDEgNTcgNDIgTDMyIDMyIFoiIGZpbGw9IiMyRjhGMUYiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIxMyIgZmlsbD0iI0ZGRkZGRiIvPgogIDxwYXRoIGQ9Ik0yNCAzMiBMMzAgMzggTDQyIDI0IEw0NiAyOCBMMzAgNDYgTDIwIDM2IFoiIGZpbGw9IiMyRjhGMUYiLz4KPC9zdmc+Cg==',
    target:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjciIGZpbGw9IiNGMUU3RkYiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOEIzQkQ3IiBzdHJva2Utd2lkdGg9IjYiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIxMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkYyQUM1IiBzdHJva2Utd2lkdGg9IjYiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSI1IiBmaWxsPSIjNkYyQUM1Ii8+Cjwvc3ZnPg==',
    sales:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHJlY3QgeD0iOCIgeT0iMzUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgcng9IjIiIGZpbGw9IiM1NUI1MkMiLz4KICA8cmVjdCB4PSIyMyIgeT0iMjgiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyNyIgcng9IjIiIGZpbGw9IiM0NUEzMjYiLz4KICA8cmVjdCB4PSIzOCIgeT0iMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIzNSIgcng9IjIiIGZpbGw9IiMyRjhGMUYiLz4KICA8cGF0aCBkPSJNOSAyOSBMMjIgMTggTDMyIDI0IEw1MSA3IEw1NSAxMiBMMzMgMzIgTDIzIDI2IEwxMyAzNCBaIiBmaWxsPSIjMkY4RjFGIi8+CiAgPHBhdGggZD0iTTQ1IDYgSDU3IFYxOCBMNTIgMTMgTDUwIDkgWiIgZmlsbD0iIzJGOEYxRiIvPgo8L3N2Zz4K',
    forecast:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHJlY3QgeD0iOCIgeT0iMzgiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxNyIgcng9IjIiIGZpbGw9IiNGRkMyNDciLz4KICA8cmVjdCB4PSIyMyIgeT0iMzEiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyNCIgcng9IjIiIGZpbGw9IiNGNUEwMDAiLz4KICA8cmVjdCB4PSIzOCIgeT0iMjIiIHdpZHRoPSIxMCIgaGVpZ2h0PSIzMyIgcng9IjIiIGZpbGw9IiNFNjgxMDAiLz4KICA8cGF0aCBkPSJNOCAzMSBMMjEgMjAgTDMxIDI2IEw1MCA5IEw1NSAxNCBMMzIgMzQgTDIyIDI4IEwxMyAzNiBaIiBmaWxsPSIjRjVBMDAwIi8+CiAgPHBhdGggZD0iTTQ1IDggSDU3IFYyMCBMNTIgMTUgTDUwIDExIFoiIGZpbGw9IiNFNjgxMDAiLz4KPC9zdmc+Cg==',
    trophy:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHBhdGggZD0iTTE5IDkgSDQ1IFYyNSBDNDUgMzYgMzkgNDIgMzIgNDIgQzI1IDQyIDE5IDM2IDE5IDI1IFoiIGZpbGw9IiNGRkIwMDAiLz4KICA8cGF0aCBkPSJNMTkgMTUgSDEwIFYyMiBDMTAgMzEgMTUgMzYgMjMgMzYgVjMwIEMxOSAzMCAxNiAyNyAxNiAyMiBWMjEgSDE5IFoiIGZpbGw9IiNGMDhBMDAiLz4KICA8cGF0aCBkPSJNNDUgMTUgSDU0IFYyMiBDNTQgMzEgNDkgMzYgNDEgMzYgVjMwIEM0NSAzMCA0OCAyNyA0OCAyMiBWMjEgSDQ1IFoiIGZpbGw9IiNGMDhBMDAiLz4KICA8cmVjdCB4PSIyOCIgeT0iNDAiIHdpZHRoPSI4IiBoZWlnaHQ9IjkiIHJ4PSIyIiBmaWxsPSIjRDk3NjAwIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjQ4IiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgcng9IjMiIGZpbGw9IiNEOTc2MDAiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjI0IiByPSI2IiBmaWxsPSIjRkZGMkE4Ii8+Cjwvc3ZnPgo=',
    comment:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHBhdGggZD0iTTkgMTJoNDZhNSA1IDAgMCAxIDUgNXYyN2E1IDUgMCAwIDEtNSA1SDMxTDE4IDU4di05SDlhNSA1IDAgMCAxLTUtNVYxN2E1IDUgMCAwIDEgNS01eiIgZmlsbD0iIzA3OURFQiIvPgogIDxwYXRoIGQ9Ik0xNiAyNGgzMk0xNiAzMmgyNU0xNiA0MGgxOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=',
    insight_trend:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjciIGZpbGw9IiNFQ0Y4RTgiLz4KICA8cGF0aCBkPSJNMTUgNDNsMTMtMTMgOSA4IDEzLTE1IiBmaWxsPSJub25lIiBzdHJva2U9IiMyRjhGMUYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgPHBhdGggZD0iTTQwIDIzaDEwdjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyRjhGMUYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==',
    insight_check:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjciIGZpbGw9IiNFOEY0RkMiLz4KICA8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIxOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTg4QkQ4IiBzdHJva2Utd2lkdGg9IjYiLz4KICA8cGF0aCBkPSJNMjIgMzJsNyA3IDE0LTE2IiBmaWxsPSJub25lIiBzdHJva2U9IiMxODhCRDgiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==',
    insight_pace:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjciIGZpbGw9IiNGRkYzRDkiLz4KICA8cGF0aCBkPSJNMTUgNDNhMjAgMjAgMCAxIDEgMzQgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRjVBMDAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0zMiAzNWwxMS0xMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRDk4NTAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxjaXJjbGUgY3g9IjMyIiBjeT0iMzUiIHI9IjQuNSIgZmlsbD0iI0Q5ODUwMCIvPgo8L3N2Zz4=',
    insight_warning:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjciIGZpbGw9IiNGREVCRUMiLz4KICA8cGF0aCBkPSJNMzIgMTNMNTMgNTBIMTFMMzIgMTN6IiBmaWxsPSIjRUUzNzM3Ii8+CiAgPHBhdGggZD0iTTMyIDI1djEyIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSI0NCIgcj0iMy41IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==',
    schedule:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHBhdGggZD0iTTggNDggTDIyIDM0IEwzMSA0MSBMNTEgMTkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE4OEJEOCIgc3Ryb2tlLXdpZHRoPSI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNNDIgMTggSDU0IFYzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMEQ2RkI1IiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    gap:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHBhdGggZD0iTTEzIDE0IFY1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRjVBMDAwIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik01MSAxNCBWNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQkUzQiIgc3Ryb2tlLXdpZHRoPSI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNMjAgMzIgSDQ0IiBmaWxsPSJub25lIiBzdHJva2U9IiNFNjgxMDAiIHN0cm9rZS13aWR0aD0iNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTM3IDI0IEw0NiAzMiBMMzcgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0U2ODEwMCIgc3Ryb2tlLXdpZHRoPSI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+',
    perday:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMjUiIGZpbGw9IiMwRDRCOEUiLz4KICA8cmVjdCB4PSIyOSIgeT0iMTUiIHdpZHRoPSI2IiBoZWlnaHQ9IjIxIiByeD0iMyIgZmlsbD0iI0ZGRkZGRiIvPgogIDxwYXRoIGQ9Ik0zMiAzMiBMNDYgNDEgTDQyIDQ3IEwyOCAzNyBaIiBmaWxsPSIjRkZGRkZGIi8+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iNCIgZmlsbD0iIzA3OTlFOCIvPgo8L3N2Zz4K'
  };
  const ICON_IMAGES = {};
  function preloadIconAssets(){
    const jobs=Object.entries(ICON_ASSETS).map(([key,src])=>new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>{ICON_IMAGES[key]=img;resolve();};
      img.onerror=()=>{console.warn('Không tải được icon',src);resolve();};
      img.src=src;
    }));
    return Promise.all(jobs);
  }
  const iconsReady = preloadIconAssets();

  const STORE_NAMES = {
    'hd':'Hà Đông','ha dong':'Hà Đông',
    'tdt':'Tôn Đức Thắng','ton duc thang':'Tôn Đức Thắng',
    'tb':'Thái Bình','thai binh':'Thái Bình',
    'vp':'Vĩnh Phúc','vinh phuc':'Vĩnh Phúc',
    'vi':'Vinh','vinh':'Vinh',
    'tdh':'Trần Duy Hưng','tran duy hung':'Trần Duy Hưng',
    'lh':'Láng Hạ','lang ha':'Láng Hạ',
    'hp':'Hải Phòng','hai phong':'Hải Phòng',
    'nd':'Nam Định','nam dinh':'Nam Định',
    'tho':'Thanh Hóa','thanh hoa':'Thanh Hóa',
    'nb':'Ninh Bình','ninh binh':'Ninh Bình',
    'had':'Hải Dương','hai duong':'Hải Dương',
    'tn':'Thái Nguyên','thai nguyen':'Thái Nguyên',
    'llq':'Lạc Long Quân','lac long quan':'Lạc Long Quân',
    'hob':'Hòa Bình','hoa binh':'Hòa Bình',
    'vt':'Việt Trì','viet tri':'Việt Trì'
  };

  const SAMPLE = `STT\tSR\tTG T8\tThực đạt\tDS CẦN ĐẠT\tThừa thiếu\tTarget cần chạy 1 ngày\tHoàn thành TG tháng
1\tHĐ\t1.050\t416,2\t406,5\t9,8\t33,4\t40%
2\tTĐT\t600\t300,0\t232,3\t67,7\t15,8\t50%
3\tTB\t500\t254,2\t193,5\t60,6\t12,9\t51%
4\tVP\t600\t249,7\t232,3\t17,4\t18,4\t42%
5\tVI\t600\t287,7\t232,3\t55,4\t16,4\t48%
6\tTDH\t400\t118,7\t154,8\t-36,1\t14,8\t30%
7\tLH\t360\t117,8\t139,4\t-21,5\t12,7\t33%
8\tHP\t400\t219,9\t154,8\t65,1\t9,5\t55%
9\tNĐ\t400\t126,7\t154,8\t-28,1\t14,4\t32%
10\tTHO\t350\t128,1\t135,5\t-7,4\t11,7\t37%
11\tNB\t350\t118,1\t135,5\t-17,4\t12,2\t34%
12\tHAD\t300\t96,4\t116,1\t-19,8\t10,7\t32%
13\tTN\t300\t91,5\t116,1\t-24,6\t11,0\t31%
14\tLLQ\t270\t95,1\t104,5\t-9,4\t9,2\t35%
15\tHOB\t270\t131,5\t104,5\t27,0\t7,3\t49%
16\tVT\t260\t87,6\t100,6\t-13,1\t9,1\t34%
\tTổng\t7.010\t2.839,1\t2.713,5\t125,6\t219,5\t41%`;

  const $ = id => document.getElementById(id);
  const els = {
    dataInput:$('dataInput'), parseBtn:$('parseBtn'), sampleBtn:$('sampleBtn'), validationBox:$('validationBox'),
    dateOverride:$('dateOverride'), exportBtn:$('exportBtn'), export4kBtn:$('export4kBtn'), previewCanvas:$('previewCanvas'), canvasWrap:$('canvasWrap'),
    previewScroll:$('previewScroll'), previewMeta:$('previewMeta'), toast:$('toast'),
    validationModal:$('validationModal'), modalTitle:$('modalTitle'), modalBadge:$('modalBadge'), modalSummary:$('modalSummary'), modalIssues:$('modalIssues'), modalCloseBtn:$('modalCloseBtn'), modalOkBtn:$('modalOkBtn')
  };
  let model = null;

  function stripAccents(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();}
  function cleanCell(s){return String(s??'').replace(/\*\*/g,'').replace(/`/g,'').trim();}
  function normHeader(s){return stripAccents(cleanCell(s)).replace(/[\n\r]+/g,' ').replace(/\s+/g,' ').trim();}
  function parseNumber(v){
    let s=cleanCell(v).replace(/\s/g,'').replace(/[^0-9,.-]/g,'');
    if(!s || s==='-' || s==='.' || s===',') return NaN;
    const neg=s.startsWith('-'); s=s.replace(/-/g,'');
    let n;
    if(s.includes(',') && s.includes('.')) n=Number(s.replace(/\./g,'').replace(',','.'));
    else if(s.includes(',')) n=Number(s.replace(',','.'));
    else if(/^\d{1,3}(\.\d{3})+$/.test(s)) n=Number(s.replace(/\./g,''));
    else n=Number(s);
    return neg?-n:n;
  }
  function parsePercent(v){const n=parseNumber(String(v??'').replace('%',''));return n;}
  function fmt1(v){return (Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1});}
  function fmt0(v){return Math.round(Number(v)||0).toLocaleString('vi-VN');}
  function fmtWhole(v){return Math.trunc(Number(v)||0).toLocaleString('vi-VN');}
  function fmtNum(v){const n=Number(v)||0;return Math.abs(n-Math.round(n))<0.05?fmt0(n):fmt1(n);}
  function fmtPct(v,d=0){return (Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d})+'%';}
  function fmtPoint(v){const n=Math.abs(Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2});return `${v>=0?'+':'−'}${n}`;}
  function fmtStatusDelta(v){const n=Math.abs(Number(v)||0).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2});return `${v>=0?'+':'-'}${n}%`;}
  function fmtSignedWhole(v){const n=Math.abs(Math.trunc(Number(v)||0)).toLocaleString('vi-VN');return `${Number(v)>=0?'+':'-'}${n}`;}
  function statusDisplay(diff){if(diff<0)return `Chậm ${fmtStatusDelta(diff)}`;if(diff<=10)return `Kịp ${fmtStatusDelta(diff)}`;return `Vượt ${fmtStatusDelta(diff)}`;}
  function parseDateVN(s){const m=String(s||'').match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);if(!m)return null;const d=+m[1],mo=+m[2],y=+m[3],dt=new Date(y,mo-1,d);return Number.isNaN(dt.getTime())?null:dt;}
  function dateVN(d){return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;}
  function isoDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function daysInMonth(y,m){return new Date(y,m,0).getDate();}
  function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
  function shadeHex(hex,factor=.62){const m=String(hex).match(/^#([0-9a-f]{6})$/i);if(!m)return hex;const n=parseInt(m[1],16);const r=Math.round(((n>>16)&255)*factor),g=Math.round(((n>>8)&255)*factor),b=Math.round((n&255)*factor);return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');}
  function median(a){const x=a.filter(Number.isFinite).sort((p,q)=>p-q);if(!x.length)return NaN;const m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2;}
  function sum(a,fn){return a.reduce((s,x)=>s+(Number(fn(x))||0),0);}
  function approx(a,b,tol){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol;}

  function splitLine(line){
    if(line.includes('\t')) return line.split('\t').map(cleanCell);
    if(line.includes('|')){
      let parts=line.split('|').map(cleanCell);
      if(parts.length&&parts[0]==='')parts.shift();
      if(parts.length&&parts[parts.length-1]==='')parts.pop();
      return parts;
    }
    return line.split(/\s{2,}/).map(cleanCell);
  }
  function isSeparatorRow(cells){return cells.length>1&&cells.every(c=>!c||/^:?-{3,}:?$/.test(c));}
  function findHeader(lines){
    for(let i=0;i<lines.length;i++){
      const cells=splitLine(lines[i]); const n=cells.map(normHeader).join(' | ');
      if(n.includes('thuc dat') && n.includes('hoan thanh tg thang') && (n.includes('tg t')||n.includes('target'))) return {i,cells};
    }
    throw new Error('Không tìm thấy dòng tiêu đề có TG T8/TG tháng, Thực đạt và Hoàn thành TG tháng.');
  }
  function columnMap(headers){
    const map={};
    headers.forEach((h,i)=>{
      const n=normHeader(h);
      if(n==='stt'||n.includes('stt'))map.stt=i;
      else if(n==='sr'||n==='cua hang'||n.includes('showroom'))map.sr=i;
      else if(/^tg\s*t\d+/.test(n)||n==='tg thang'||n.includes('target thang'))map.target=i;
      else if(n.includes('thuc dat'))map.actual=i;
      else if(n.includes('ds can dat'))map.need=i;
      else if(n.includes('thua thieu'))map.surplus=i;
      else if(n.includes('target can chay')||n.includes('can chay 1 ngay'))map.perDay=i;
      else if(n.includes('hoan thanh tg thang'))map.completion=i;
    });
    if(map.sr==null||map.target==null||map.actual==null||map.completion==null) throw new Error('Thiếu cột bắt buộc: SR, TG T8/TG tháng, Thực đạt hoặc Hoàn thành TG tháng.');
    return map;
  }
  function detectTargetMonth(header){const m=normHeader(header).match(/tg\s*t(\d{1,2})/);return m?clamp(+m[1],1,12):null;}
  function storeDisplay(code){const n=stripAccents(code);return STORE_NAMES[n]||cleanCell(code).toUpperCase();}

  function parsePastedData(text){
    const rawLines=String(text||'').replace(/\r/g,'').split('\n').filter(l=>l.trim());
    if(!rawLines.length) throw new Error('Chưa có dữ liệu.');
    const found=findHeader(rawLines);
    const headerIndex=found.i; let headers=[...found.cells];
    // Markdown đôi khi có một ô tiêu đề trống ở đầu nhưng dữ liệu lại bắt đầu ngay từ STT.
    // Tự bỏ ô trống này để đúng với mẫu bảng người dùng cung cấp.
    if(headers.length>1 && !normHeader(headers[0]) && normHeader(headers[1]).includes('stt')) headers.shift();
    const col=columnMap(headers);
    const targetMonth=detectTargetMonth(headers[col.target]);
    const issues=[]; const rows=[]; let totalRow=null;

    for(let i=headerIndex+1;i<rawLines.length;i++){
      const cells=splitLine(rawLines[i]); if(isSeparatorRow(cells))continue;
      while(cells.length<headers.length)cells.push('');
      const sr=cleanCell(cells[col.sr]); const nSr=stripAccents(sr);
      if(!sr)continue;
      const rec={
        sourceLine:i+1,
        stt:col.stt!=null?cleanCell(cells[col.stt]):'', sr,
        name:storeDisplay(sr),
        target:parseNumber(cells[col.target]), actual:parseNumber(cells[col.actual]),
        pastedNeed:col.need!=null?parseNumber(cells[col.need]):NaN,
        pastedSurplus:col.surplus!=null?parseNumber(cells[col.surplus]):NaN,
        pastedPerDay:col.perDay!=null?parseNumber(cells[col.perDay]):NaN,
        pastedCompletion:parsePercent(cells[col.completion])
      };
      if(nSr==='tong'||nSr==='total'){totalRow=rec;continue;}
      if(!Number.isFinite(rec.target)||!Number.isFinite(rec.actual)){issues.push({type:'err',text:`Dòng ${i+1} – ${sr}: TG tháng hoặc Thực đạt không phải số.`});continue;}
      rows.push(rec);
    }
    if(!rows.length) throw new Error('Không đọc được dữ liệu cửa hàng.');

    // Date priority: manual override > explicit "Cập nhật ngày" > today from the device clock.
    // Default reporting rule: update date = today, closing date = end of yesterday.
    // DS CẦN ĐẠT is never used to infer the report date; it is only cross-checked below.
    let updateDate=null, dateSource='';
    if(els.dateOverride.value){
      const d=new Date(els.dateOverride.value+'T00:00:00');
      if(!Number.isNaN(d.getTime())){updateDate=d;dateSource='Ngày nhập tay';}
    }
    if(!updateDate){
      for(const line of rawLines){
        if(stripAccents(line).includes('cap nhat ngay')){
          const d=parseDateVN(line);
          if(d){updateDate=d;dateSource='Dòng Cập nhật ngày';break;}
        }
      }
    }
    if(!updateDate){
      const now=new Date();
      updateDate=new Date(now.getFullYear(),now.getMonth(),now.getDate());
      dateSource='Ngày hệ thống – tự động';
    }

    const autoClosingDate=new Date(updateDate);
    autoClosingDate.setDate(autoClosingDate.getDate()-1);
    let reportMonth=targetMonth || (autoClosingDate.getMonth()+1);
    let reportYear=autoClosingDate.getFullYear();
    let totalDays=daysInMonth(reportYear,reportMonth);
    let currentDay=autoClosingDate.getDate();

    if(autoClosingDate.getMonth()+1!==reportMonth){
      issues.push({type:'warn',text:`Cột target là TG T${reportMonth} nhưng ngày chốt tự động là ${dateVN(autoClosingDate)}. Hãy kiểm tra lại tháng báo cáo hoặc nhập ngày cập nhật thủ công.`});
      // Keep the actual closing date for the report header, but calculate the time progress
      // against the target month. This makes the mismatch visible instead of silently inferring a date.
      currentDay=clamp(autoClosingDate.getDate(),1,totalDays);
    }

    totalDays=daysInMonth(reportYear,reportMonth);
    const closingDate=autoClosingDate;
    const timeProgress=currentDay/totalDays*100;
    const remainingDays=Math.max(0,totalDays-currentDay);

    const seen=new Set();
    rows.forEach((r,idx)=>{
      const key=stripAccents(r.sr); if(seen.has(key))issues.push({type:'err',text:`Trùng SR ${r.sr}.`}); seen.add(key);
      r.rankInput=Number(r.stt)||idx+1;
      r.calcCompletion=r.target>0?r.actual/r.target*100:0;
      r.pct=Number.isFinite(r.pastedCompletion)?r.pastedCompletion:r.calcCompletion; // requested source for schedule comparison
      r.timeDiff=r.pct-timeProgress;
      r.status=statusFromDiff(r.timeDiff);
      r.expectedNeed=r.target*timeProgress/100;
      r.surplusVsSchedule=r.actual-r.expectedNeed;
      r.gapToKpi=r.target-r.actual;
      r.requiredPerDay=r.gapToKpi>0&&remainingDays>0?r.gapToKpi/remainingDays:0;
      if(Number.isFinite(r.pastedCompletion)&&Math.abs(r.pastedCompletion-r.calcCompletion)>0.6) issues.push({type:'warn',text:`${r.sr}: Hoàn thành TG tháng dán ${fmtPct(r.pastedCompletion)} nhưng Thực đạt/TG tháng = ${fmtPct(r.calcCompletion,1)}.`});
      if(Number.isFinite(r.pastedNeed)&&Math.abs(r.pastedNeed-r.expectedNeed)>0.6) issues.push({type:'warn',text:`${r.sr}: DS CẦN ĐẠT dán ${fmt1(r.pastedNeed)}; tool tính ${fmt1(r.expectedNeed)}.`});
      if(Number.isFinite(r.pastedSurplus)&&Math.abs(r.pastedSurplus-r.surplusVsSchedule)>0.7) issues.push({type:'warn',text:`${r.sr}: Thừa thiếu dán ${fmt1(r.pastedSurplus)}; tool tính ${fmt1(r.surplusVsSchedule)}.`});
      if(Number.isFinite(r.pastedPerDay)&&Math.abs(r.pastedPerDay-r.requiredPerDay)>0.7) issues.push({type:'warn',text:`${r.sr}: Target/ngày dán ${fmt1(r.pastedPerDay)}; tool tính ${fmt1(r.requiredPerDay)}.`});
    });

    const sumTarget=sum(rows,r=>r.target), sumActual=sum(rows,r=>r.actual);
    let systemTarget=totalRow&&Number.isFinite(totalRow.target)?totalRow.target:sumTarget;
    let systemActual=totalRow&&Number.isFinite(totalRow.actual)?totalRow.actual:sumActual;
    let systemCalcPct=systemTarget>0?systemActual/systemTarget*100:0;
    let systemPct=totalRow&&Number.isFinite(totalRow.pastedCompletion)?totalRow.pastedCompletion:systemCalcPct;
    let systemDiff=systemPct-timeProgress;
    let systemStatus=statusFromDiff(systemDiff);
    let systemGap=Math.max(0,systemTarget-systemActual);
    let requiredPerDay=systemGap>0&&remainingDays>0?systemGap/remainingDays:0;
    let forecast=currentDay>0?systemActual/currentDay*totalDays:0;
    let forecastPct=systemTarget>0?forecast/systemTarget*100:0;
    let averagePerDay=currentDay>0?systemActual/currentDay:0;
    let expectedByTime=systemTarget*timeProgress/100;
    let scheduleValueDelta=systemActual-expectedByTime;

    if(totalRow){
      if(Math.abs(totalRow.target-sumTarget)>0.8)issues.push({type:'warn',text:`Tổng TG tháng dán ${fmt1(totalRow.target)} lệch tổng 16 cửa hàng ${fmt1(sumTarget)}.`});
      if(Math.abs(totalRow.actual-sumActual)>0.8)issues.push({type:'warn',text:`Tổng Thực đạt dán ${fmt1(totalRow.actual)} lệch tổng 16 cửa hàng ${fmt1(sumActual)}.`});
      if(Number.isFinite(totalRow.pastedCompletion)&&Math.abs(totalRow.pastedCompletion-systemCalcPct)>0.6)issues.push({type:'warn',text:`Tổng Hoàn thành TG tháng dán ${fmtPct(totalRow.pastedCompletion)} nhưng Thực đạt/TG tháng = ${fmtPct(systemCalcPct,1)}.`});
      if(Number.isFinite(totalRow.pastedNeed)){
        const exp=systemTarget*timeProgress/100;if(Math.abs(totalRow.pastedNeed-exp)>0.8)issues.push({type:'warn',text:`Tổng DS CẦN ĐẠT dán ${fmt1(totalRow.pastedNeed)}; tool tính ${fmt1(exp)}.`});
      }
      if(Number.isFinite(totalRow.pastedSurplus)){
        const exp=systemActual-systemTarget*timeProgress/100;if(Math.abs(totalRow.pastedSurplus-exp)>0.8)issues.push({type:'warn',text:`Tổng Thừa thiếu dán ${fmt1(totalRow.pastedSurplus)}; tool tính ${fmt1(exp)}.`});
      }
      if(Number.isFinite(totalRow.pastedPerDay)&&Math.abs(totalRow.pastedPerDay-requiredPerDay)>0.8)issues.push({type:'warn',text:`Tổng Target/ngày dán ${fmt1(totalRow.pastedPerDay)}; tool tính ${fmt1(requiredPerDay)}.`});
    }

    const sorted=[...rows].sort((a,b)=>b.pct-a.pct||b.actual-a.actual||a.rankInput-b.rankInput);
    const top5=sorted.slice(0,5);
    const groups={green:[],blue:[],orange:[],red:[]}; sorted.forEach(r=>groups[r.status.key].push(r));
    const onTrackCount=sorted.filter(r=>r.timeDiff>=0).length;
    const slowCount=sorted.length-onTrackCount;
    const onTrackPct=sorted.length?onTrackCount/sorted.length*100:0;
    const slowPct=sorted.length?slowCount/sorted.length*100:0;
    const topStore=sorted[0]||null, bottomStore=sorted[sorted.length-1]||null;
    const topBottomDiff=topStore&&bottomStore?topStore.pct-bottomStore.pct:0;
    return {rows,totalRow,issues,targetMonth:reportMonth,reportYear,currentDay,totalDays,remainingDays,updateDate,closingDate,dateSource,timeProgress,systemTarget,systemActual,systemPct,systemCalcPct,systemDiff,systemStatus,systemGap,requiredPerDay,forecast,forecastPct,averagePerDay,expectedByTime,scheduleValueDelta,sorted,top5,groups,onTrackCount,slowCount,onTrackPct,slowPct,topStore,bottomStore,topBottomDiff};
  }

  function statusFromDiff(diff){
    if(diff < -10) return {key:'red',label:'CHẬM NHIỀU',color:C.red,note:'Thấp hơn kế hoạch trên 10 điểm %'};
    if(diff < 0) return {key:'orange',label:'CHẬM',color:C.orange,note:'Thấp hơn tiến độ thời gian'};
    if(diff <= 10) return {key:'blue',label:'KỊP',color:C.blue,note:'Bám sát / nhỉnh hơn kế hoạch'};
    return {key:'green',label:'VƯỢT NHIỀU',color:C.green,note:'Vượt xa tiến độ thời gian'};
  }

  function run(show=true){
    try{
      model=parsePastedData(els.dataInput.value);
      localStorage.setItem(STORAGE_KEY,JSON.stringify({data:els.dataInput.value,date:els.dateOverride.value}));
      renderValidation();
      renderPreview();
      if(show){
        const errs=model.issues.filter(x=>x.type==='err');
        const warns=model.issues.filter(x=>x.type==='warn');
        if(errs.length||warns.length) showValidationPopup(errs,warns);
        else toast('Dữ liệu hợp lệ • Dashboard đã cập nhật');
      }
    }
    catch(err){
      model=null;
      els.validationBox.innerHTML=`<div class="err">✕ ${escapeHtml(err.message)}</div>`;
      clearCanvas();
      if(show) showFatalPopup(err.message);
    }
  }
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function renderValidation(){
    const m=model; const errs=m.issues.filter(x=>x.type==='err'), warns=m.issues.filter(x=>x.type==='warn');
    const lines=[];
    lines.push(`<div class="ok">✓ Nhận ${m.rows.length} cửa hàng • Target T${m.targetMonth}: ${fmt1(m.systemTarget)}</div>`);
    lines.push(`<div class="ok">✓ Ngày cập nhật: ${dateVN(m.updateDate)} • chốt ${dateVN(m.closingDate)} • ${m.currentDay}/${m.totalDays} ngày</div>`);
    lines.push(`<div class="muted">Nguồn ngày: ${escapeHtml(m.dateSource)}</div>`);
    lines.push(`<div class="ok">✓ Tiến độ thời gian: ${fmtPct(m.timeProgress,1)} • Hoàn thành hệ thống dùng để so: ${fmtPct(m.systemPct)}</div>`);
    lines.push(`<div class="ok">✓ GAP KPI: ${fmt1(m.systemGap)} • cần ${fmt1(m.requiredPerDay)}/ngày • forecast ${fmtPct(m.forecastPct,1)}</div>`);
    if(!errs.length&&!warns.length)lines.push(`<div class="ok">✓ Các cột đối chiếu đều khớp trong ngưỡng làm tròn.</div>`);
    if(errs.length||warns.length)lines.push(`<div class="section">${errs.length} lỗi • ${warns.length} cảnh báo</div>`);
    [...errs,...warns].slice(0,22).forEach(x=>lines.push(`<div class="${x.type}">${x.type==='err'?'✕':'⚠'} ${escapeHtml(x.text)}</div>`));
    if(errs.length+warns.length>22)lines.push(`<div class="muted">… còn ${errs.length+warns.length-22} cảnh báo khác.</div>`);
    els.validationBox.innerHTML=lines.join('');
    els.previewMeta.textContent=`${m.rows.length} cửa hàng • ${errs.length} lỗi • ${warns.length} cảnh báo`;
  }


  function openModal(){
    els.validationModal.classList.add('show');
    els.validationModal.setAttribute('aria-hidden','false');
    setTimeout(()=>els.modalOkBtn.focus(),20);
  }
  function closeModal(){
    els.validationModal.classList.remove('show');
    els.validationModal.setAttribute('aria-hidden','true');
  }
  function showValidationPopup(errs,warns){
    const hasError=errs.length>0;
    els.validationModal.querySelector('.modal-card').classList.toggle('has-error',hasError);
    els.modalBadge.textContent=hasError?'PHÁT HIỆN LỖI':'CÓ CẢNH BÁO';
    els.modalTitle.textContent=hasError?'Dữ liệu có lỗi cần xử lý':'Có dữ liệu cần kiểm tra lại';
    els.modalSummary.textContent=`${errs.length} lỗi • ${warns.length} cảnh báo. Dashboard vẫn hiển thị các dòng đọc được; hãy kiểm tra trước khi xuất ảnh.`;
    const all=[...errs,...warns];
    els.modalIssues.innerHTML=all.slice(0,16).map(x=>`<div class="modal-issue ${x.type}">${x.type==='err'?'✕':'⚠'} ${escapeHtml(x.text)}</div>`).join('')+(all.length>16?`<div class="modal-more">… còn ${all.length-16} mục khác. Xem đầy đủ ở phần “3. Kiểm tra dữ liệu”.</div>`:'');
    openModal();
  }
  function showFatalPopup(message){
    els.validationModal.querySelector('.modal-card').classList.add('has-error');
    els.modalBadge.textContent='DỮ LIỆU KHÔNG HỢP LỆ';
    els.modalTitle.textContent='Không thể phân tích bảng dữ liệu';
    els.modalSummary.textContent='Tool chưa tạo Dashboard mới. Vui lòng sửa dữ liệu và bấm “Phân tích dữ liệu” lại.';
    els.modalIssues.innerHTML=`<div class="modal-issue err">✕ ${escapeHtml(message)}</div>`;
    openModal();
  }

  // ---------- CANVAS HELPERS ----------
  function canvasWeight(weight='400'){return String(weight)==='700'?'700':'400';}
  function ctxFont(ctx,size,weight='400'){ctx.font=`${canvasWeight(weight)} ${size}px ${FONT_STACK}`;ctx.textBaseline='top';ctx.fontKerning='normal';}
  function text(ctx,s,x,y,size=16,color=C.text,weight='400',align='left'){ctx.save();ctxFont(ctx,size,weight);ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(String(s),x,y);ctx.restore();}
  function textMiddle(ctx,s,x,y,size=16,color=C.text,weight='700',align='center'){ctx.save();ctx.font=`${canvasWeight(weight)} ${size}px ${FONT_STACK}`;ctx.textBaseline='middle';ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(String(s),x,y);ctx.restore();}
  function fitText(ctx,s,x,y,maxW,size,color=C.text,weight='700',align='left',min=10){let z=size;while(z>min){ctxFont(ctx,z,weight);if(ctx.measureText(String(s)).width<=maxW)break;z-=.5;}text(ctx,s,x,y,z,color,weight,align);}
  function fitTextMiddle(ctx,s,x,y,maxW,size,color=C.text,weight='700',align='left',min=10){let z=size;while(z>min){ctx.save();ctx.font=`${canvasWeight(weight)} ${z}px ${FONT_STACK}`;const ok=ctx.measureText(String(s)).width<=maxW;ctx.restore();if(ok)break;z-=.5;}textMiddle(ctx,s,x,y,z,color,weight,align);}
  function wrapLines(ctx,s,maxW,size=14,weight='400',maxLines=3){ctx.save();ctxFont(ctx,size,weight);const words=String(s).trim().split(/\s+/).filter(Boolean);const lines=[];let line='',used=0;for(let idx=0;idx<words.length;idx++){const w=words[idx];const test=line?line+' '+w:w;if(line&&ctx.measureText(test).width>maxW){lines.push(line);line=w;if(lines.length===maxLines-1){used=idx+1;break;}}else{line=test;used=idx+1;}}if(line&&lines.length<maxLines)lines.push(line);const truncated=used<words.length;if(truncated&&lines.length){let last=lines[lines.length-1];while(last.length>2&&ctx.measureText(last+'…').width>maxW)last=last.slice(0,-1);lines[lines.length-1]=last+'…';}ctx.restore();return lines.length?lines:[''];}
  function wrap(ctx,s,x,y,maxW,lineH,size=14,color=C.text,weight='400',maxLines=3){const lines=wrapLines(ctx,s,maxW,size,weight,maxLines);ctx.save();ctxFont(ctx,size,weight);ctx.fillStyle=color;ctx.textAlign='left';lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineH));ctx.restore();return y+lines.length*lineH;}
  function rr(ctx,x,y,w,h,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
  function line(ctx,x1,y1,x2,y2,color,lw=1){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}
  function circle(ctx,x,y,r,fill,stroke=null,lw=1){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}ctx.restore();}
  function gradient(ctx,x,y,w,h,a,b,vertical=false){const g=vertical?ctx.createLinearGradient(x,y,x,y+h):ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
  function shadowCard(ctx,x,y,w,h,r=10){ctx.save();ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=7;ctx.shadowOffsetY=2;rr(ctx,x,y,w,h,r,'#fff');ctx.restore();}
  function progress(ctx,x,y,w,h,pct,color,marker=null){rr(ctx,x,y,w,h,h/2,C.track);const fw=w*clamp(pct,0,100)/100;if(fw>0)rr(ctx,x,y,fw,h,h/2,color);if(Number.isFinite(marker)){const mx=x+w*clamp(marker,0,100)/100;line(ctx,mx,y-3,mx,y+h+3,'#48525c',1.3);}}
  function arrowIcon(ctx,x,y,size,color,down=false){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(down){ctx.moveTo(x,y);ctx.lineTo(x+size*.34,y+size*.34);ctx.lineTo(x+size*.62,y+size*.08);ctx.lineTo(x+size,y+size*.48);ctx.moveTo(x+size*.72,y+size*.48);ctx.lineTo(x+size,y+size*.48);ctx.lineTo(x+size,y+size*.20);}else{ctx.moveTo(x,y+size*.48);ctx.lineTo(x+size*.34,y+size*.14);ctx.lineTo(x+size*.62,y+size*.40);ctx.lineTo(x+size,y);ctx.moveTo(x+size*.72,y);ctx.lineTo(x+size,y);ctx.lineTo(x+size,y+size*.28);}ctx.stroke();ctx.restore();}

  function drawAssetIcon(ctx,key,cx,cy,size){
    const img=ICON_IMAGES[key];
    if(img && img.complete && img.naturalWidth){
      ctx.save();
      ctx.imageSmoothingEnabled=true;
      ctx.drawImage(img,cx-size/2,cy-size/2,size,size);
      ctx.restore();
      return true;
    }
    return false;
  }

  function drawCrispMetricIcon(ctx,type,cx,cy,size,color){
    // Flat 2D icon set: large, sharp, no white rim/badge and no glow.
    const r=size/2, dark=shadeHex(color,.62), light=color;
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=0;ctx.strokeStyle=light;ctx.fillStyle=light;ctx.lineWidth=Math.max(3,size*.065);
    if(type==='clock'){
      circle(ctx,cx,cy,r*.45,light);
      ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(3,size*.055);ctx.beginPath();ctx.arc(cx,cy,r*.31,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,cy-r*.22);ctx.lineTo(cx,cy+r*.02);ctx.lineTo(cx+r*.19,cy+r*.13);ctx.stroke();circle(ctx,cx,cy,r*.045,'#fff');
    }else if(type==='target'){
      ctx.strokeStyle=light;ctx.lineWidth=Math.max(3.3,size*.062);ctx.beginPath();ctx.arc(cx-r*.03,cy+r*.03,r*.36,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(cx-r*.03,cy+r*.03,r*.19,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=dark;ctx.lineWidth=Math.max(3.4,size*.064);ctx.beginPath();ctx.moveTo(cx-r*.02,cy+r*.02);ctx.lineTo(cx+r*.42,cy-r*.42);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+r*.23,cy-r*.42);ctx.lineTo(cx+r*.42,cy-r*.42);ctx.lineTo(cx+r*.42,cy-r*.23);ctx.stroke();
    }else if(type==='calendar'){
      rr(ctx,cx-r*.43,cy-r*.35,r*.86,r*.74,r*.08,light);rr(ctx,cx-r*.43,cy-r*.35,r*.86,r*.22,r*.08,dark);
      ctx.strokeStyle=dark;ctx.lineWidth=Math.max(2.8,size*.052);line(ctx,cx-r*.23,cy-r*.46,cx-r*.23,cy-r*.27,dark,Math.max(2.8,size*.052));line(ctx,cx+r*.23,cy-r*.46,cx+r*.23,cy-r*.27,dark,Math.max(2.8,size*.052));
      [[-.22,.00],[0,.00],[.22,.00],[-.22,.20],[0,.20],[.22,.20]].forEach(([dx,dy])=>circle(ctx,cx+r*dx,cy+r*dy,r*.045,'#fff'));
    }else if(type==='sales'||type==='forecast'){
      const base=cy+r*.36,bw=r*.18;[[-.38,.34],[-.10,.55],[.18,.78]].forEach(([dx,h],i)=>{rr(ctx,cx+r*dx,base-r*h,bw,r*h,r*.025,i===2?dark:light);});
      ctx.strokeStyle=dark;ctx.lineWidth=Math.max(3.2,size*.058);ctx.beginPath();ctx.moveTo(cx-r*.42,cy+r*.08);ctx.lineTo(cx-r*.14,cy-r*.12);ctx.lineTo(cx+r*.04,cy+r*.01);ctx.lineTo(cx+r*.42,cy-r*.38);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+r*.23,cy-r*.38);ctx.lineTo(cx+r*.42,cy-r*.38);ctx.lineTo(cx+r*.42,cy-r*.19);ctx.stroke();
    }else if(type==='schedule'){
      ctx.strokeStyle=light;ctx.lineWidth=Math.max(3.5,size*.066);ctx.beginPath();ctx.moveTo(cx-r*.42,cy+r*.25);ctx.lineTo(cx-r*.12,cy-r*.05);ctx.lineTo(cx+r*.06,cy+r*.08);ctx.lineTo(cx+r*.42,cy-r*.32);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+r*.22,cy-r*.32);ctx.lineTo(cx+r*.42,cy-r*.32);ctx.lineTo(cx+r*.42,cy-r*.12);ctx.stroke();
    }else if(type==='gap'){
      ctx.strokeStyle=light;ctx.lineWidth=Math.max(3.5,size*.066);ctx.beginPath();ctx.moveTo(cx-r*.38,cy-r*.20);ctx.lineTo(cx+r*.10,cy-r*.20);ctx.lineTo(cx+r*.10,cy+r*.27);ctx.stroke();ctx.beginPath();ctx.moveTo(cx-r*.18,cy+r*.06);ctx.lineTo(cx+r*.10,cy+r*.27);ctx.lineTo(cx+r*.38,cy-r*.02);ctx.stroke();
    }
    ctx.restore();
  }

  function drawCrispTrophy(ctx,cx,cy,size,color){
    const r=size/2,dark=shadeHex(color,.63);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=0;
    rr(ctx,cx-r*.27,cy-r*.39,r*.54,r*.53,r*.07,color);
    ctx.strokeStyle=dark;ctx.lineWidth=Math.max(2.6,size*.06);ctx.beginPath();ctx.moveTo(cx-r*.27,cy-r*.24);ctx.bezierCurveTo(cx-r*.61,cy-r*.24,cx-r*.55,cy+r*.10,cx-r*.22,cy+r*.02);ctx.moveTo(cx+r*.27,cy-r*.24);ctx.bezierCurveTo(cx+r*.61,cy-r*.24,cx+r*.55,cy+r*.10,cx+r*.22,cy+r*.02);ctx.stroke();
    rr(ctx,cx-r*.07,cy+r*.12,r*.14,r*.27,r*.02,dark);rr(ctx,cx-r*.31,cy+r*.36,r*.62,r*.13,r*.03,dark);
    circle(ctx,cx,cy-r*.11,r*.08,'#fff3b0');ctx.restore();
  }

  function drawCrispChat(ctx,cx,cy,size,color){
    const r=size/2,dark=shadeHex(color,.64);ctx.save();ctx.shadowBlur=0;
    rr(ctx,cx-r*.46,cy-r*.32,r*.92,r*.62,r*.12,color);ctx.fillStyle=dark;ctx.beginPath();ctx.moveTo(cx-r*.20,cy+r*.24);ctx.lineTo(cx-r*.29,cy+r*.50);ctx.lineTo(cx+r*.02,cy+r*.28);ctx.closePath();ctx.fill();
    [-.22,0,.22].forEach(dx=>circle(ctx,cx+r*dx,cy-r*.01,r*.052,'#fff'));ctx.restore();
  }

  function drawInsightIcon(ctx,type,cx,cy,size,color){
    const r=size/2;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=0;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=Math.max(2.8,size*.082);
    if(type==='trend'){ctx.beginPath();ctx.moveTo(cx-r*.62,cy+r*.34);ctx.lineTo(cx-r*.18,cy-r*.10);ctx.lineTo(cx+r*.08,cy+r*.10);ctx.lineTo(cx+r*.58,cy-r*.46);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+r*.29,cy-r*.46);ctx.lineTo(cx+r*.58,cy-r*.46);ctx.lineTo(cx+r*.58,cy-r*.17);ctx.stroke();}
    else if(type==='check'){circle(ctx,cx,cy,r*.52,'transparent',color,Math.max(2.8,size*.082));ctx.beginPath();ctx.moveTo(cx-r*.31,cy);ctx.lineTo(cx-r*.06,cy+r*.24);ctx.lineTo(cx+r*.36,cy-r*.29);ctx.stroke();}
    else if(type==='pace'){ctx.beginPath();ctx.arc(cx,cy+r*.10,r*.51,Math.PI,0);ctx.stroke();ctx.beginPath();ctx.moveTo(cx,cy+r*.10);ctx.lineTo(cx+r*.34,cy-r*.25);ctx.stroke();circle(ctx,cx,cy+r*.10,r*.07,color);}
    else if(type==='warning'){ctx.beginPath();ctx.moveTo(cx,cy-r*.58);ctx.lineTo(cx+r*.60,cy+r*.50);ctx.lineTo(cx-r*.60,cy+r*.50);ctx.closePath();ctx.stroke();line(ctx,cx,cy-r*.23,cx,cy+r*.15,color,Math.max(2.8,size*.082));circle(ctx,cx,cy+r*.34,r*.06,color);}
    ctx.restore();
  }

  function iconCircle(ctx,cx,cy,r,color,type){circle(ctx,cx,cy,r,'#fff');ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';if(type==='clock'){circle(ctx,cx,cy,r-7,'transparent',color,4);ctx.beginPath();ctx.moveTo(cx,cy-r*.44);ctx.lineTo(cx,cy);ctx.lineTo(cx+r*.30,cy+r*.18);ctx.stroke();}
    else if(type==='target'){circle(ctx,cx,cy,r-7,'transparent',color,4);circle(ctx,cx,cy,r*.42,'transparent',color,3);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*.58,cy-r*.58);ctx.moveTo(cx+r*.36,cy-r*.58);ctx.lineTo(cx+r*.58,cy-r*.58);ctx.lineTo(cx+r*.58,cy-r*.36);ctx.stroke();}
    else if(type==='calendar'){rr(ctx,cx-r*.48,cy-r*.42,r*.96,r*.82,3,'transparent',color,3);line(ctx,cx-r*.48,cy-r*.15,cx+r*.48,cy-r*.15,color,3);line(ctx,cx-r*.25,cy-r*.55,cx-r*.25,cy-r*.31,color,3);line(ctx,cx+r*.25,cy-r*.55,cx+r*.25,cy-r*.31,color,3);for(let i=0;i<3;i++)for(let j=0;j<2;j++)circle(ctx,cx-r*.27+i*r*.27,cy+r*.06+j*r*.23,2.2,color);}
    else if(type==='sales'){ctx.beginPath();ctx.moveTo(cx-r*.52,cy+r*.45);ctx.lineTo(cx-r*.52,cy+r*.05);ctx.lineTo(cx-r*.28,cy+r*.05);ctx.lineTo(cx-r*.28,cy+r*.45);ctx.moveTo(cx-r*.10,cy+r*.45);ctx.lineTo(cx-r*.10,cy-r*.15);ctx.lineTo(cx+r*.14,cy-r*.15);ctx.lineTo(cx+r*.14,cy+r*.45);ctx.moveTo(cx+r*.31,cy+r*.45);ctx.lineTo(cx+r*.31,cy-r*.42);ctx.lineTo(cx+r*.55,cy-r*.42);ctx.lineTo(cx+r*.55,cy+r*.45);ctx.stroke();arrowIcon(ctx,cx-r*.50,cy-r*.52,r*.95,color,false);}
    else if(type==='forecast'){ctx.beginPath();ctx.moveTo(cx-r*.52,cy+r*.45);ctx.lineTo(cx-r*.52,cy+r*.05);ctx.lineTo(cx-r*.28,cy+r*.05);ctx.lineTo(cx-r*.28,cy+r*.45);ctx.moveTo(cx-r*.10,cy+r*.45);ctx.lineTo(cx-r*.10,cy-r*.15);ctx.lineTo(cx+r*.14,cy-r*.15);ctx.lineTo(cx+r*.14,cy+r*.45);ctx.moveTo(cx+r*.31,cy+r*.45);ctx.lineTo(cx+r*.31,cy-r*.42);ctx.lineTo(cx+r*.55,cy-r*.42);ctx.lineTo(cx+r*.55,cy+r*.45);ctx.stroke();arrowIcon(ctx,cx-r*.52,cy-r*.52,r*.9,color,false);}
    ctx.restore();}
  function trophy(ctx,x,y,size,color){ctx.save();ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=2;rr(ctx,x+size*.32,y,size*.36,size*.44,4,color);ctx.beginPath();ctx.moveTo(x+size*.32,y+size*.08);ctx.bezierCurveTo(x+size*.04,y+size*.08,x+size*.08,y+size*.34,x+size*.34,y+size*.30);ctx.moveTo(x+size*.68,y+size*.08);ctx.bezierCurveTo(x+size*.96,y+size*.08,x+size*.92,y+size*.34,x+size*.66,y+size*.30);ctx.stroke();rr(ctx,x+size*.45,y+size*.42,size*.10,size*.25,2,color);rr(ctx,x+size*.28,y+size*.66,size*.44,size*.10,3,color);ctx.restore();}
  function chatIcon(ctx,x,y,size,color){ctx.save();ctx.fillStyle=color;rr(ctx,x,y,size,size*.68,4,color);ctx.beginPath();ctx.moveTo(x+size*.22,y+size*.66);ctx.lineTo(x+size*.18,y+size*.90);ctx.lineTo(x+size*.42,y+size*.68);ctx.fill();ctx.fillStyle='#fff';for(let i=0;i<3;i++)circle(ctx,x+size*.25+i*size*.22,y+size*.34,1.8,'#fff');ctx.restore();}
  function donut(ctx,cx,cy,r,pct,color1,color2){ctx.save();ctx.lineWidth=18;ctx.strokeStyle='#e7eaed';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();const g=ctx.createLinearGradient(cx-r,cy-r,cx+r,cy+r);g.addColorStop(0,color1);g.addColorStop(1,color2);ctx.strokeStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp(pct,0,100)/100);ctx.stroke();ctx.restore();}
  function drawBackground(ctx){const g=ctx.createLinearGradient(0,0,1536,1024);g.addColorStop(0,'#07131e');g.addColorStop(.55,'#081722');g.addColorStop(1,'#06111b');ctx.fillStyle=g;ctx.fillRect(0,0,1536,1024);ctx.save();ctx.globalAlpha=.08;for(let i=0;i<28;i++){circle(ctx,40+i*63,980-(i%5)*14,1.1,'#39b7ef');}ctx.restore();}

  function drawDashboard(ctx,m){
    drawBackground(ctx);
    // HEADER
    fitText(ctx,'KPI HIỆU SUẤT',26,14,300,43,'#fff','700');
    fitText(ctx,'HỆ THỐNG BÁN LẺ',329,14,520,43,'#079de8','700');
    text(ctx,'THEO DÕI % HOÀN THÀNH THEO CỬA HÀNG',26,66,21,'#f1f4f6','700');
    // Compact update card: shrink background to content and center the whole icon + text group.
    const updX=1200, updY=8, updW=312, updH=84;
    shadowCard(ctx,updX,updY,updW,updH,10);
    const updIconX=updX+38, updTopY=updY+29, updTextCX=updX+180;
    drawAssetIcon(ctx,'calendar',updIconX,updTopY,34);
    fitText(ctx,'CẬP NHẬT DỮ LIỆU',updTextCX,updY+11,214,15.5,C.text,'700','center',13.5);
    fitText(ctx,dateVN(m.updateDate),updTextCX,updY+33,214,26,'#0a62b4','700','center',22);
    fitText(ctx,`SỐ LIỆU CHỐT HẾT NGÀY ${dateVN(m.closingDate)}`,updX+updW/2,updY+66,278,13.2,C.text,'700','center',11.8);

    // KPI ROW — fixed SVG icon assets + centered primary values.
    const y=101,h=132;
    // 1. Time progress
    shadowCard(ctx,23,y,327,h,10);
    drawAssetIcon(ctx,'clock',61,y+50,75);
    text(ctx,'TIẾN ĐỘ THỜI GIAN',107,y+16,18.5,C.text,'700');
    fitText(ctx,fmtPct(m.timeProgress,1),195,y+43,248,51,C.blue,'700','center',41);
    fitText(ctx,`${m.currentDay}/${m.totalDays} NGÀY ĐÃ QUA`,327,y+96,268,14.8,C.muted,'700','right',12.8);
    progress(ctx,41,y+116,291,11,m.timeProgress,C.blue);

    // 2. Target completion — status color follows the schedule rule.
    shadowCard(ctx,358,y,352,h,10);
    drawAssetIcon(ctx,'completion_green',396,y+50,71);
    text(ctx,'TỶ LỆ HOÀN THÀNH TARGET',439,y+17,17.2,C.text,'700');
    fitText(ctx,fmtPct(m.systemPct,1),542,y+44,298,53,C.greenDark,'700','center',42);
    fitText(ctx,`(${fmtWhole(m.systemActual)} / ${fmtWhole(m.systemTarget)})   |   ${fmtPoint(m.systemDiff)} điểm %`,534,y+104,322,18.8,C.text,'700','center',15.5);

    // 3. Monthly target
    shadowCard(ctx,717,y,276,h,10);
    drawAssetIcon(ctx,'target',754,y+50,71);
    text(ctx,`TARGET THÁNG ${m.targetMonth}`,797,y+19,18,C.text,'700');
    fitText(ctx,fmtNum(m.systemTarget),863,y+52,232,51,C.purple,'700','center',37);

    // 4 + 5. Average daily sales and month-end forecast
    shadowCard(ctx,999,y,514,h,10);
    const halfW=257,leftCX=999+halfW/2,rightCX=999+halfW+halfW/2;
    drawAssetIcon(ctx,'average_day',1029,y+49,60);
    text(ctx,'DOANH SỐ BÌNH QUÂN',1071,y+14,14.1,C.text,'700');
    text(ctx,'/ NGÀY',1071,y+34,14.1,C.text,'700');
    fitText(ctx,fmtWhole(m.averagePerDay),leftCX+8,y+52,214,48,C.greenDark,'700','center',38);
    fitText(ctx,`${fmtWhole(m.systemActual)} / ${m.currentDay} ngày`,leftCX,y+104,220,17.7,C.text,'700','center',14.8);
    line(ctx,1256,y+13,1256,y+120,'#aeb6bc',1.2);
    drawAssetIcon(ctx,'forecast',1287,y+49,60);
    text(ctx,'DỰ ĐOÁN DOANH SỐ',1330,y+14,14.4,C.text,'700');
    text(ctx,'CUỐI THÁNG',1330,y+34,14.4,C.text,'700');
    fitText(ctx,fmtPct(m.forecastPct,0),rightCX+8,y+52,214,48,'#f06f12','700','center',38);
    fitText(ctx,`≈ ${fmtWhole(m.forecast)}`,rightCX,y+104,220,19,'#f06f12','700','center',15);

    // LEFT TABLE — sorted descending by completion.
    const lx=23,ly=241,lw=880,lh=680;shadowCard(ctx,lx,ly,lw,lh,10);ctx.save();ctx.fillStyle=gradient(ctx,lx,ly,lw,47,'#0b437e','#0c3b70');ctx.beginPath();ctx.roundRect(lx,ly,lw,47,[10,10,0,0]);ctx.fill();ctx.restore();
    // Column order: STT | Cửa hàng | % | Tiến độ | +/- TG | Trạng thái.
    text(ctx,'STT',56,257,15.5,'#fff','700','center');
    text(ctx,'CỬA HÀNG',100,257,15.5,'#fff','700');
    text(ctx,'%',305,257,16,'#fff','700','center');
    text(ctx,'TIẾN ĐỘ',499,249,14.5,'#fff','700','center');
    text(ctx,'THỰC ĐẠT / TARGET THÁNG',499,269,11.5,'#dbe9f7','700','center');
    text(ctx,'+/- TG',704,257,14.5,'#fff','700','center');
    text(ctx,'TRẠNG THÁI',824,257,14.5,'#fff','700','center');
    const rowH=35.6, startY=289; const xBar=340,barW=318;
    m.sorted.forEach((r,i)=>{
      const ry=startY+i*rowH;if(i>0)line(ctx,lx+18,ry,lx+lw-18,ry,'#dfe2e5',1);
      circle(ctx,56,ry+18,13,r.status.color);textMiddle(ctx,i+1,56,ry+18.5,14.5,'#fff','700','center');
      fitText(ctx,r.name,100,ry+7,185,19.5,C.ink,'700','left',16.5);
      text(ctx,fmtPct(r.pct,0),305,ry+7,21,r.status.color,'700','center');
      progress(ctx,xBar,ry+13,barW,12,r.pct,r.status.color,m.timeProgress);
      text(ctx,fmtStatusDelta(r.timeDiff),704,ry+9,15.5,r.status.color,'700','center');
      circle(ctx,772,ry+18,5.5,r.status.color);
      fitTextMiddle(ctx,r.status.label,784,ry+18.5,104,13.8,r.status.color,'700','left',12.2);
    });
    const axisY=876;[0,25,50,75,100].forEach(v=>{const x=xBar+barW*v/100;text(ctx,`${v}%`,x,axisY,13.2,C.ink,'700','center');});

    // RIGHT TOP 5
    const rx=912,rw=601;shadowCard(ctx,rx,241,rw,208,10);ctx.fillStyle=gradient(ctx,rx,241,rw,44,'#0b437e','#0c3b70');ctx.beginPath();ctx.roundRect(rx,241,rw,44,[10,10,0,0]);ctx.fill();drawAssetIcon(ctx,'trophy',949,263,46);text(ctx,'TOP 5 CỬA HÀNG DẪN ĐẦU',982,250,20,'#fff','700');
    m.top5.forEach((r,i)=>{const yy=289+i*31.0;circle(ctx,948,yy+14,12,r.status.color);textMiddle(ctx,i+1,948,yy+14.5,13.5,'#fff','700','center');fitText(ctx,r.name,978,yy+3,173,16.5,C.ink,'700');progress(ctx,1152,yy+10,253,11,r.pct,r.status.color,m.timeProgress);text(ctx,fmtPct(r.pct,0),1445,yy+2,18,r.status.color,'700');});

    // RIGHT INSIGHTS — dynamic vertical spacing by actual wrapped content.
    const insY=457,insH=360;shadowCard(ctx,rx,insY,rw,insH,10);ctx.fillStyle=gradient(ctx,rx,insY,rw,44,'#0b437e','#0c3b70');ctx.beginPath();ctx.roundRect(rx,insY,rw,44,[10,10,0,0]);ctx.fill();drawAssetIcon(ctx,'comment',950,479,46);text(ctx,'NHẬN XÉT',985,467,22,'#fff','700');
    const groupDefs=[
      ['green','trend','VƯỢT NHIỀU (> +10 ĐIỂM %)',C.green,'Duy trì nhịp bán và tối ưu tồn kho.'],
      ['blue','check','KỊP (0 → +10 ĐIỂM %)',C.blue,'Bám sát kế hoạch; giữ tốc độ hiện tại.'],
      ['orange','pace','CHẬM (−10 → < 0 ĐIỂM %)',C.orange,'Cần tăng tốc để về đúng tiến độ.'],
      ['red','warning','CHẬM NHIỀU (< −10 ĐIỂM %)',C.red,'Ưu tiên hành động quyết liệt ngay.']
    ];
    const contentTop=insY+51, contentBottom=insY+insH-8, contentH=contentBottom-contentTop;
    const layouts=groupDefs.map(g=>{
      const arr=m.groups[g[0]],names=arr.length?arr.map(x=>x.name).join(', '):'Không có';
      const lines=wrapLines(ctx,names,492,15.5,'700',2);
      const natural=5+18+3+lines.length*16.5+3+14+5;
      return {g,names,lines,natural};
    });
    const naturalTotal=layouts.reduce((a,x)=>a+x.natural,0);
    const extra=Math.max(0,contentH-naturalTotal),extraEach=extra/layouts.length;
    let gy=contentTop;
    layouts.forEach((it,gi)=>{
      let gh=it.natural+extraEach;if(gi===layouts.length-1)gh=contentBottom-gy;
      if(gi)line(ctx,930,gy,1493,gy,'#d9dde0',1);
      const titleY=gy+4,namesY=titleY+22;
      drawAssetIcon(ctx,`insight_${it.g[1]}`,949,gy+gh/2,34);
      fitText(ctx,it.g[2],978,titleY,500,15.7,it.g[3],'700','left',14);
      ctx.save();ctxFont(ctx,15.5,'700');ctx.fillStyle=C.ink;ctx.textAlign='left';it.lines.forEach((ln,li)=>ctx.fillText(ln,978,namesY+li*16.5));ctx.restore();
      const actionY=namesY+it.lines.length*16.5+3;
      fitText(ctx,it.g[4],978,actionY,500,13.6,it.g[3],'700','left',12.2);
      gy+=gh;
    });

    // LOWER RIGHT: absolute schedule value + GAP KPI.
    const lowY=825,lowH=90;shadowCard(ctx,rx,lowY,rw,lowH,10);
    const splitX=1208;
    line(ctx,splitX,lowY+9,splitX,lowY+81,'#c3c9ce',1.2);

    // Absolute value versus time schedule: Actual − (Target × elapsed-time ratio).
    const scheduleValue=m.scheduleValueDelta;
    const scheduleValueColor=m.systemStatus.color;
    const scheduleValueTitle=scheduleValue>=0?'DOANH SỐ VƯỢT TIẾN ĐỘ':'DOANH SỐ CHẬM TIẾN ĐỘ';
    text(ctx,scheduleValueTitle,1060,lowY+9,15.7,C.navy2,'700','center');
    drawAssetIcon(ctx,'schedule',950,lowY+59,40);
    fitText(ctx,fmtSignedWhole(scheduleValue),1072,lowY+37,205,29,scheduleValueColor,'700','center',23);
    fitText(ctx,`Kế hoạch theo TG: ${fmtWhole(m.expectedByTime)}`,1072,lowY+66,225,14.2,C.text,'700','center',12.6);

    // GAP module: GAP value + required daily action.
    text(ctx,'GAP TO KPI',1360,lowY+9,16.2,C.orange,'700','center');
    const gapInnerTop=lowY+34, gapInnerBottom=lowY+82, gapSplit=1362;
    line(ctx,gapSplit,gapInnerTop,gapSplit,gapInnerBottom,'#d2d6da',1);
    drawAssetIcon(ctx,'gap',1242,lowY+58,38);
    fitText(ctx,fmtWhole(m.systemGap),1310,lowY+48,91,25,C.orange,'700','center',19);
    text(ctx,'CẦN ĐẠT / NGÀY',1434,lowY+38,12.8,C.navy2,'700','center');
    fitText(ctx,fmt1(m.requiredPerDay),1434,lowY+56,126,23,C.navy2,'700','center',17);

    // AUXILIARY MANAGEMENT METRICS — three readable horizontal blocks, one line each.
    const auxY=923,auxH=44,auxX=23,auxW=1490,auxGap=10,auxSeg=(auxW-auxGap*2)/3;
    const aux=[
      {label:'ĐẠT TIẾN ĐỘ:',value:`${fmtPct(m.onTrackPct,1)}  •  ${m.onTrackCount}/${m.sorted.length} CH`,color:C.greenDark},
      {label:'CHẬM TIẾN ĐỘ:',value:`${fmtPct(m.slowPct,1)}  •  ${m.slowCount}/${m.sorted.length} CH`,color:C.red},
      {label:'CHÊNH LỆCH TOP-BOTTOM:',value:`${fmtNum(m.topBottomDiff)} điểm %`,color:C.navy2}
    ];
    aux.forEach((a,i)=>{
      const sx=auxX+i*(auxSeg+auxGap);
      rr(ctx,sx,auxY,auxSeg,auxH,8,'#ffffff','#cfd5da',1);
      rr(ctx,sx,auxY,6,auxH,4,a.color);
      textMiddle(ctx,a.label,sx+20,auxY+auxH/2,15.8,C.text,'700','left');
      fitTextMiddle(ctx,a.value,sx+auxSeg-18,auxY+auxH/2,auxSeg-285,19.5,a.color,'700','right',16.0);
    });

    // FOOTER STATUS LEGEND — moved to the very bottom.
    const legendY=973,legendH=48;
    rr(ctx,23,legendY,1490,legendH,8,'rgba(6,18,29,.86)','#607181',1);
    const legend=[
      [C.red,'CHẬM NHIỀU:','< −10 điểm %','Thấp hơn kế hoạch đáng kể'],
      [C.orange,'CHẬM:','−10 đến < 0 điểm %','Thấp hơn tiến độ thời gian'],
      [C.blue,'KỊP:','0 đến +10 điểm %','Bám sát / nhỉnh hơn kế hoạch'],
      [C.green,'VƯỢT NHIỀU:','> +10 điểm %','Vượt xa tiến độ thời gian']
    ];
    const footerX=23,footerW=1490,seg=footerW/4,dotR=7.4,dotD=dotR*2;
    const labelSize=15.3,condSize=12.6,noteSize=11.4,gapDot=8,gapText=8;
    legend.forEach((l,i)=>{
      const sx=footerX+i*seg,center=sx+seg/2;
      if(i)line(ctx,sx,legendY+7,sx,legendY+legendH-7,'rgba(145,160,173,.25)',1);
      ctx.save();ctx.font=`700 ${labelSize}px ${FONT_STACK}`;const lw=ctx.measureText(l[1]).width;ctx.font=`700 ${condSize}px ${FONT_STACK}`;const cw=ctx.measureText(l[2]).width;ctx.restore();
      const total=dotD+gapDot+lw+gapText+cw,startX=center-total/2;
      circle(ctx,startX+dotR,legendY+16,dotR,l[0]);
      ctx.save();ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle=l[0];ctx.font=`700 ${labelSize}px ${FONT_STACK}`;ctx.fillText(l[1],startX+dotD+gapDot,legendY+16);ctx.fillStyle='#f5f7f8';ctx.font=`700 ${condSize}px ${FONT_STACK}`;ctx.fillText(l[2],startX+dotD+gapDot+lw+gapText,legendY+16);ctx.restore();
      fitText(ctx,l[3],center,legendY+31,seg-28,noteSize,'#eef2f5','700','center',10.2);
    });
  }

  function clearCanvas(){const c=els.previewCanvas,ctx=c.getContext('2d');ctx.fillStyle=C.bg;ctx.fillRect(0,0,c.width,c.height);text(ctx,'Dán dữ liệu và bấm “Đối chiếu & tạo Dashboard”',c.width/2,c.height/2-10,20,'#9fb1bf','700','center');}
  function renderPreview(){const c=els.previewCanvas;c.width=BASE.w;c.height=BASE.h;const ctx=c.getContext('2d',{alpha:false});drawDashboard(ctx,model);fitPreview();}
  function fitPreview(){const maxW=Math.max(320,els.previewScroll.clientWidth-36),maxH=Math.max(320,els.previewScroll.clientHeight-36);const scale=Math.min(maxW/BASE.w,maxH/BASE.h,1);els.previewCanvas.style.width=`${Math.round(BASE.w*scale)}px`;els.previewCanvas.style.height=`${Math.round(BASE.h*scale)}px`;els.canvasWrap.style.width=`${Math.round(BASE.w*scale)}px`;els.canvasWrap.style.height=`${Math.round(BASE.h*scale)}px`;}
  function canvasToBlob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Không tạo được PNG.')),'image/png'));}
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}
  async function exportPng(spec,button){
    if(!model){toast('Hãy phân tích dữ liệu trước');return;}
    const oldHtml=button.innerHTML;
    try{
      els.exportBtn.disabled=true;els.export4kBtn.disabled=true;
      button.innerHTML=`<span class="export-icon">…</span><span><strong>Đang xuất ${spec.tag}</strong><small>${spec.w} × ${spec.h} px</small></span>`;
      const c=document.createElement('canvas');c.width=spec.w;c.height=spec.h;
      const ctx=c.getContext('2d',{alpha:false});const scale=spec.w/BASE.w;
      ctx.setTransform(scale,0,0,scale,0,0);drawDashboard(ctx,model);
      const blob=await canvasToBlob(c);
      downloadBlob(blob,`KPI-He-Thong-Ban-Le-${isoDate(model.closingDate)}-${spec.tag}.png`);
      toast(`Đã xuất PNG ${spec.tag}`);
    }catch(e){console.error(e);toast('Xuất ảnh thất bại');}
    finally{els.exportBtn.disabled=false;els.export4kBtn.disabled=false;button.innerHTML=oldHtml;}
  }
  function toast(msg){els.toast.textContent=msg;els.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>els.toast.classList.remove('show'),1800);}
  function load(){try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');els.dataInput.value=s.data||SAMPLE;els.dateOverride.value=s.date||'';}catch(_){els.dataInput.value=SAMPLE;}}

  els.parseBtn.addEventListener('click',()=>iconsReady.then(()=>run(true)));
  els.sampleBtn.addEventListener('click',()=>{els.dataInput.value=SAMPLE;els.dateOverride.value='';iconsReady.then(()=>run(true));});
  els.exportBtn.addEventListener('click',async()=>{await iconsReady;return exportPng(EXPORT_2K,els.exportBtn);});
  els.export4kBtn.addEventListener('click',async()=>{await iconsReady;return exportPng(EXPORT_4K,els.export4kBtn);});
  els.modalCloseBtn.addEventListener('click',closeModal);
  els.modalOkBtn.addEventListener('click',closeModal);
  els.validationModal.addEventListener('click',e=>{if(e.target===els.validationModal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&els.validationModal.classList.contains('show'))closeModal();});
  els.dateOverride.addEventListener('change',()=>iconsReady.then(()=>run(false)));
  window.addEventListener('resize',fitPreview);
  load();
  iconsReady.then(()=>run(false));
})();
