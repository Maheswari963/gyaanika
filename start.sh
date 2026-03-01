#!/bin/bash

cd "$(dirname "$0")" || exit

gnome-terminal -- bash -c "cd gyaanika-backend && npm start; exec bash" &
gnome-terminal -- bash -c "cd gyaanika-frontend && npm run dev; exec bash" &
